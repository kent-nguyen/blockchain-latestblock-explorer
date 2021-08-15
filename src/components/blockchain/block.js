import React, { Component } from "react";

export default class Block extends Component {
  render = () => {
    return (
      <div className="px-4 py-5 bg-white shadow overflow-hidden rounded-lg w-full">
        <dl>
          <div className="bg-gray-50 px-1 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Block Number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
              {this.props.block.number}
            </dd>
          </div>
          <div className="bg-white px-1 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Number of transactions
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {this.props.block.transactions
                ? this.props.block.transactions.length
                : ""}
            </dd>
          </div>
          <div className="bg-gray-50 px-1 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Miner</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {this.props.block.miner}
            </dd>
          </div>
          <div className="bg-white px-1 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Total Difficulty
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {this.props.block.totalDifficulty}
            </dd>
          </div>
        </dl>
      </div>
    );
  };
}
