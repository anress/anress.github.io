import "./App.scss";
import React, { Component } from "react";
import { Table, Button } from "antd";
import { logs } from "./database/logs";
// import { tasks } from "./database/tasks";
import { tasks } from "./database/auditlog";
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
  LabelList,
} from "recharts";
import log from "./database/audit.log";

var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value, name } = props;
  const radius = 12;

  return (
    <g>
      <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#76bed0" />
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
      <text
        className="category-label"
        x={x + width / 2}
        y={y - 25}
        fill="#000"
        dominantBaseline="middle"
        textAnchor="middle"
        writingMode={"vertical-rtl"}
      >
        {name}
      </text>
    </g>
  );
};

const colors = ["#f55d3e", "#f7cb15", "#76bed0"];

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
    currentTask: {
      taskName: "All tasks",
      startTime: new Date(2021, 5, 21),
      endTime: new Date(2021, 5, 23),
    },
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
      sorter: (a, b) => a.executionTime - b.executionTime,
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
      sorter: (a, b) => a.query.advanced !== undefined && b.query.advanced !== undefined ? a.query.advanced.length - b.query.advanced.length : -1,
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
    var dataNew = logs.filter(
      (item) =>
        dayjs(item.timestamp).isSameOrAfter(dayjs(task.startTime)) &&
        dayjs(item.timestamp).isSameOrBefore(dayjs(task.endTime))
    );
    this.setState({
      data: dataNew,
      currentTask: task,
    });
  };

  clearTask = () => {
    this.setState({
      data: this.getCompetitionLogs(),
      currentTask: {
        taskName: "All tasks",
        startTime: new Date(2021, 5, 21),
        endTime: new Date(2021, 5, 23),
      },
    });
  };

  getCompetitionLogs = () => {
    return logs.filter(
      (item) =>
        (dayjs(item.timestamp).isSameOrAfter(
          dayjs(new Date(2021, 5, 21, 13, 30))
        ) &&
          dayjs(item.timestamp).isSameOrBefore(
            dayjs(new Date(2021, 5, 21, 17, 0))
          )) ||
        (dayjs(item.timestamp).isSameOrAfter(
          dayjs(new Date(2021, 5, 23, 11, 30))
        ) &&
          dayjs(item.timestamp).isSameOrBefore(
            dayjs(new Date(2021, 5, 23, 15, 0))
          ))
    );
  };

  componentDidMount = () => {
    this.setState({ data: this.getCompetitionLogs() });
    // console.log(dataNew.length);
  };

  render() {
    let currentTask = this.state.currentTask;
    let tasksCompetition = tasks.filter(
      (item) =>
        (dayjs(item.startTime).isSameOrAfter(
          dayjs(new Date(2021, 5, 21, 13, 30))
        ) &&
          dayjs(item.startTime).isSameOrBefore(
            dayjs(new Date(2021, 5, 23, 17, 0))
          )) ||
        (dayjs(item.startTime).isSameOrAfter(
          dayjs(new Date(2021, 5, 21, 11, 30))
        ) &&
          dayjs(item.startTime).isSameOrBefore(
            dayjs(new Date(2021, 5, 23, 15, 0))
          ))
    );

    let taskButtons = tasksCompetition.map((item, index) =>  (
      <Button
        key={index}
        onClick={() => this.setRange(item)}
        type={item.taskName === currentTask.taskName ? "primary" : ""}
      >
        Task {index} - {item.taskName}, {dayjs(item.startTime).format("DD.MM, HH:mm")} -{" "}
        {dayjs(item.endTime).format("HH:mm")}
      </Button>
    ));

    console.log(taskButtons.filter(item => item));

    let totalExecutionTime = this.state.data.reduce(
      (a, b) => a + b.executionTime,
      0
    );
    let averageExecutionTime = totalExecutionTime / this.state.data.length;

    let frameColor = this.state.data.filter(item => item.query.frame.hasColor);
    let frameCount = this.state.data.filter(item => item.query.frame.hasAmount);
console.log("color; " + frameColor.length);
console.log("count " + frameCount.length);

    let advanceds = this.state.data.map((item) => item.query.advanced);
    advanceds = [].concat.apply([], advanceds);

    console.log(advanceds);
    console.log(advanceds.filter(item => item && item.hasColor).length);

    console.log(advanceds.filter(item => item && item.hasAmount).length);

    console.log(advanceds.filter(item => item && item.hasPosition).length);    
    console.log(advanceds.filter(item => item && item.hasConfidence).length);
    console.log(advanceds.filter(item => item && item.hasSize).length);
    console.log(advanceds.filter(item => item && item.isTemporalQuery).length);

    let barData = [];

    console.log(this.state.data);
    objects.forEach((element) => {
      let count = advanceds.filter(
        (item) => item !== undefined && item.objectId === element._id
      ).length;

      // console.log(element.name + ": " + count);
      // console.log(element._id);
      barData.push({ name: element.name, count: count });
    });

    barData.push({});

    console.log(barData.sort((a, b) => (a.count < b.count ? 1 : -1)));

    // console.log(barData.filter(item => item.count === 0).length);

    return (
      <div className="App">
        <div>
          <Button
            onClick={this.clearTask}
            type={currentTask.taskName === "All tasks" ? "primary" : ""}
          >
            All
          </Button>
          {taskButtons}
        </div>

        <BarChart
          width={1700}
          height={800}
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
          <Bar dataKey={"count"} fill="#76bed0" width={30}>
            {/* <LabelList dataKey="count" content={renderCustomizedLabel} /> */}
            {/* {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))} */}
          </Bar>
        </BarChart>

        <h2>
          {currentTask.taskName +
            " " +
            dayjs(currentTask.startTime).format("DD.MM HH:mm") +
            " - " +
            dayjs(currentTask.endTime).format("DD.MM. HH:mm")}
        </h2>
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
