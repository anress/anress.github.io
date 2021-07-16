import "./App.scss";
import React, { Component } from "react";
import { Table, Button } from "antd";
import { logs } from "./database/logs";
import { tasks } from "./database/tasks";
import { objects } from "./database/objectsTable";
import "antd/dist/antd.css";
import dayjs from "dayjs";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import ObjectIcon from "./Components/ObjectIcon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

const expandedRowRender = (row) => {
  const columns = [
    {
      title: "Object",
      dataIndex: "objectId",
      key: "objectId",
      render: (item, row) => <ObjectIcon showTooltip objectId={item} />,
    },
    {
      title: "Amount",
      dataIndex: "hasAmount",
      key: "hasAmount",
      render: (item, row) => (
        <div>
          {item ? (
            <div>
              <CheckOutlined />{" "}
              {row.amount[0] === row.amount[1]
                ? row.amount[0]
                : row.amount[0] + "-" + row.amount[1]}
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
    {
      title: "Color",
      dataIndex: "hasColor",
      key: "hasColor",
      render: (item, row) => (
        <div>
          {item ? (
            <div>
              <CheckOutlined />{" "}
              <div
                className="color-swatch"
                style={{
                  backgroundColor:
                    "rgb(" +
                    row.color.r +
                    "," +
                    row.color.g +
                    "," +
                    row.color.b +
                    ")",
                }}
              />
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
    {
      title: "Confidence",
      dataIndex: "hasConfidence",
      key: "hasConfidence",
      render: (item, row) => (
        <div>
          {item ? (
            <div>
              <CheckOutlined /> {row.confidence}%
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
    {
      title: "Position",
      dataIndex: "hasPosition",
      key: "hasPosition",
      render: (item, row) => (
        <div>
          {item ? (
            <div>
              <CheckOutlined /> {row.position}
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "hasSize",
      key: "hasSize",
      render: (item, row) => (
        <div>
          {item ? (
            <div>
              <CheckOutlined /> {row.size}%
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
    {
      title: "is Temporal Query",
      dataIndex: "isTemporalQuery",
      key: "isTemporalQuery",
      render: (item, row) => (
        <div>
          {item ? (
            <div>
              <CheckOutlined />
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
  ];

  return (
    row.query.advanced !== undefined &&
    row.query.advanced.length > 0 && (
      <Table
        columns={columns}
        dataSource={row.query.advanced}
        pagination={false}
        rowKey={row._id}
      />
    )
  );
};

class App extends Component {
  state = {
    data: [],
  };

  columns = [
    {
      title: "Timestamp",
      key: "timestamp",
      dataIndex: "timestamp",
      render: (item, row) => <div>{dayjs(item).format("DD.MM., HH:mm")}</div>,
    },
    {
      title: "Execution Time",
      key: "executionTime",
      dataIndex: "executionTime",
    },
    {
      title: "# of Results",
      key: "results",
      dataIndex: "results",
    },
    {
      title: "# of Advanced Filters",
      key: "nrOfAdvanced",
      dataIndex: "query",
      render: (item, row) => (
        <div>{item.advanced !== undefined ? item.advanced.length : 0}</div>
      ),
    },
    {
      title: "Frame Amount",
      key: "hasFrameAmount",
      dataIndex: "query",
      render: (item, row) => (
        <div>
          {item.frame.hasAmount ? (
            <div>
              <CheckOutlined />{" "}
              {item.frame.amount[0] === item.frame.amount[1]
                ? item.frame.amount[0]
                : item.frame.amount[0] + "-" + item.frame.amount[1]}
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
    {
      title: "Frame Color",
      key: "hasFrameColor",
      dataIndex: "query",
      render: (item, row) => (
        <div>
          {item.frame.hasColor ? (
            <div>
              <CheckOutlined />{" "}
              <div
                className="color-swatch"
                style={{
                  backgroundColor:
                    "rgb(" +
                    item.frame.color.r +
                    "," +
                    item.frame.color.g +
                    "," +
                    item.frame.color.b +
                    ")",
                }}
              />
            </div>
          ) : (
            <CloseOutlined />
          )}
        </div>
      ),
    },
  ];

  setRange = (task) => {
    console.log(task);
    var dataNew = logs.filter(
      (item) =>
        dayjs(item.timestamp).isSameOrAfter(dayjs(task.timeStart)) &&
        dayjs(item.timestamp).isSameOrBefore(dayjs(task.timeEnd))
    );
    this.setState({ data: dataNew });
  };

  clearTask = () => {
    this.setState({ data: logs });
  };

  componentDidMount = () => {
    this.setState({ data: logs });
  };

  render() {
    let taskButtons = tasks.map((item, index) => (
      <Button key={index} onClick={() => this.setRange(item)}>
        Task {index}
      </Button>
    ));

    let advanceds = this.state.data.map((item) => item.query.advanced);
    advanceds = [].concat.apply([], advanceds);

    let barData = [];

    objects.forEach(element => {
        let count = advanceds.filter(item => item !== undefined && item.objectId === element._id).length;
        barData.push({name: element.name, count: count});
    });

    // let bars = objects.map((item) => <Bar dataKey={item._id} fill="#8884d8" />);
    console.log(advanceds);

    return (
      <div className="App">
        <div>
          <Button onClick={this.clearTask}>All</Button>
          {taskButtons}
        </div>

        <BarChart
          width={1000}
          height={600}
          data={barData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={"count"} fill="#8884d8" />
        </BarChart>

        <Table
          rowKey="_id"
          dataSource={this.state.data}
          columns={this.columns}
          pagination={false}
          expandable={{ expandedRowRender }}
        />
      </div>
    );
  }
}

export default App;
