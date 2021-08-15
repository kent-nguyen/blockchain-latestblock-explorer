import React from "react";
import Layout from "../components/Layout";
import Block from "../components/blockchain/block";
import Transactions from "../components/blockchain/transactions";

import Web3 from "web3";
import web3Extension from "@energi/web3-ext";
const web3 = new Web3("https://nodeapi.energi.network");
web3Extension.extend(web3);

export default class IndexPage extends React.Component {
  /**
   * Interval timer for polling new block number
   */
  timer = null;

  /**
   * Current latest block number
   */
  latestBlockNumber = null;

  waitTime = 5; // Wait 5 seconds for next request

  iddleMessage = `Iddle. Wait ${this.waitTime} seconds for next request.`;

  constructor(props) {
    super(props);
    this.state = {
      allowRun: true,
      status: this.iddleMessage,
      blocks: [],
      transactions: [
        {
          hash: "0x123",
          value: 12,
          gas: 3,
        },
      ],
    };
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stop();
  }

  start() {
    this.setState({
      ...this.state,
      allowRun: true,
      status: "Polling for new block number",
    });
    this.pollNewBlockNumber();
    this.timer = setInterval(
      () => this.pollNewBlockNumber(),
      this.waitTime * 1000
    );
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
    this.setState({
      ...this.state,
      allowRun: false,
      status: "Stopped.",
    });
  }

  async pollNewBlockNumber() {
    try {
      const blockNumber = await web3.nrg.getBlockNumber();
      if (blockNumber === this.latestBlockNumber) {
        this.setState({
          ...this.state,
          status: this.iddleMessage,
        });
        return;
      }

      this.latestBlockNumber = blockNumber;
      await this.fetchBlockData(blockNumber);
    } catch (error) {
      this.setState({
        ...this.state,
        status: this.iddleMessage,
      });
      console.log(error.message);
    }
  }

  async fetchBlockData(blockNumber) {
    try {
      this.setState({
        ...this.state,
        status: "Found new block. Fetching new block data.",
      });

      const data = await web3.nrg.getBlock(blockNumber);
      this.setState({
        ...this.state,
        blocks: [data, ...this.state.blocks],
        status: "Fetching transactions data",
      });

      await this.fetchTransactionsData(data.transactions);
    } catch (error) {
      this.setState({
        ...this.state,
        status: this.iddleMessage,
      });
      console.log(error);
    }
  }

  async fetchTransactionsData(transactionHashes) {
    try {
      const promises = transactionHashes.map(hash => {
        return web3.nrg.getTransaction(hash);
      });

      // If one request fails, all requests are failed.
      // If we want error tolerance, we have to request one-by-one, consume more time.
      const transactions = await Promise.all(promises);
      transactions.forEach(trans => {
        // Convert to NRG unit before parseFloat() because native js can not read big number
        // Convert to float number for sorting
        trans.value = parseFloat(web3.utils.fromWei(trans.value));

        trans.gas = web3.utils.fromWei(trans.gas.toString(), "gwei");
      });
      transactions.sort((a, b) => b.value - a.value); // Sort descending

      this.setState({
        ...this.state,
        transactions,
        status: this.iddleMessage,
      });
    } catch (error) {
      this.setState({
        ...this.state,
        status: this.iddleMessage,
      });
      console.log(error);
    }
  }

  onStartStop() {
    const allowRun = !this.state.allowRun;

    if (allowRun) {
      this.start();
    } else {
      this.stop();
    }
  }

  render() {
    return (
      <Layout>
        <main className="w-full mx-auto flex flex-col xl:flex-row sm:space-y-8 xl:space-y-0 xl:space-x-4 mt-4 p-4">
          <div className="flex flex-col flex-1">
            <div className="flex flex-row px-4 bg-white py-5 shadow overflow-hidden rounded-lg w-full">
              <button
                className="bg-teal-500 h-10 px-5 font-medium text-white transition-colors duration-150 rounded-lg hover:bg-teal-600"
                onClick={this.onStartStop.bind(this)}
              >
                {this.state.allowRun ? "Stop" : "Start"}
              </button>
              <div className="ml-4 leading-10">{this.state.status}</div>
            </div>
            <div className="flex flex-col px-4 bg-white py-4 shadow w-full mt-8">
              <div className="mb-8">
                Transactions of block {this.latestBlockNumber}{" "}
              </div>
              <Transactions transactions={this.state.transactions} />
            </div>
          </div>
          <div className="flex flex-col flex-1 items-center">
            {this.state.blocks.map(block => (
              <div
                className="w-full flex flex-col items-center"
                key={block.number}
              >
                <Block block={block} />
                <img
                  src="/images/chain.png"
                  alt="chain"
                  className="my-1"
                  width="40"
                />
              </div>
            ))}
          </div>
        </main>
      </Layout>
    );
  }
}
