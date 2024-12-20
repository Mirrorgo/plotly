import React, { useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { Button } from "../ui/button";
import Demension from "./demension";

// 基础数据结构
const nodes = [
  {
    id: "1",
    name: "小米",
    device: "手机",
    region: "华北",
    dau: 15000,
    stalls: 3500,
  },
  {
    id: "2",
    name: "华为",
    device: "手机",
    region: "华南",
    dau: 20000,
    stalls: 4500,
  },
  {
    id: "3",
    name: "比亚迪",
    device: "车载",
    region: "华东",
    dau: 25000,
    stalls: 5000,
  },
  {
    id: "4",
    name: "小米",
    device: "桌面",
    region: "华北",
    dau: 12000,
    stalls: 3000,
  },
  {
    id: "5",
    name: "华为",
    device: "音箱",
    region: "西南",
    dau: 18000,
    stalls: 40000,
  },
  {
    id: "6",
    name: "小天才",
    device: "手表",
    region: "华中",
    dau: 10000,
    stalls: 2500,
  },
];

// 计算分类汇总数据
function calculateTotals(nodes, groupBy) {
  const totals = new Map();

  nodes.forEach((node) => {
    const key = node[groupBy];
    if (!totals.has(key)) {
      totals.set(key, { dau: 0, stalls: 0 });
    }
    const groupTotals = totals.get(key);
    groupTotals.dau += node.dau;
    groupTotals.stalls += node.stalls;
  });

  return totals;
}

function PlotlyTreemap() {
  // 默认按终端类型分组
  const [groupBy, setGroupBy] = useState("device");

  const { labels, parents, daus, stalls } = useMemo(() => {
    const groupTotals = calculateTotals(nodes, groupBy);

    // 计算总计
    const totalDau = nodes.reduce((sum, node) => sum + node.dau, 0);
    const totalStalls = nodes.reduce((sum, node) => sum + node.stalls, 0);

    // 构建树形图所需的数据结构
    let treeData = [
      // 根节点
      {
        name: "总计",
        parent: "",
        dau: totalDau,
        stalls: totalStalls,
      },
    ];

    // 根据选择的维度构建树形结构
    if (groupBy === "device") {
      treeData = [
        ...treeData,
        // 终端类型节点
        ...Array.from(groupTotals.entries()).map(([device, totals]) => ({
          name: device,
          parent: "总计",
          dau: totals.dau,
          stalls: totals.stalls,
        })),
        // 具体企业节点
        ...nodes.map((node) => ({
          name: `${node.name}-${node.device}`,
          parent: node.device,
          dau: node.dau,
          stalls: node.stalls,
        })),
      ];
    } else if (groupBy === "name") {
      treeData = [
        ...treeData,
        // 企业节点
        ...Array.from(groupTotals.entries()).map(([name, totals]) => ({
          name: name,
          parent: "总计",
          dau: totals.dau,
          stalls: totals.stalls,
        })),
        // 具体终端类型节点
        ...nodes.map((node) => ({
          name: `${node.device}-${node.name}`,
          parent: node.name,
          dau: node.dau,
          stalls: node.stalls,
        })),
      ];
    } else {
      // 按地区分组
      treeData = [
        ...treeData,
        // 地区节点
        ...Array.from(groupTotals.entries()).map(([region, totals]) => ({
          name: region,
          parent: "总计",
          dau: totals.dau,
          stalls: totals.stalls,
        })),
        // 具体设备和企业节点
        ...nodes.map((node) => ({
          name: `${node.name}-${node.device}`,
          parent: node.region,
          dau: node.dau,
          stalls: node.stalls,
        })),
      ];
    }

    return {
      labels: treeData.map((item) => item.name),
      parents: treeData.map((item) => item.parent),
      daus: treeData.map((item) => item.dau),
      stalls: treeData.map((item) => item.stalls),
    };
  }, [groupBy]);

  const data = [
    {
      type: "treemap",
      labels,
      parents,
      values: daus,
      customdata: stalls,
      marker: {
        colors: stalls,
        colorscale: [
          [0, "#fff7ec"],
          [0.5, "#fc8d59"],
          [1, "#7f0000"],
        ],
        showscale: true,
        colorbar: {
          title: "卡顿数量 (次)",
          thickness: 20,
        },
      },
      textinfo: "label+value",
      hovertemplate:
        "<b>%{label}</b><br>DAU: %{value:,.0f}<br>卡顿数量: %{customdata:,.0f}次<extra></extra>",
      branchvalues: "total",
    },
  ];

  const layout = {
    width: 800,
    height: 600,
    title: {
      text: `卡顿分析树形图 - ${
        groupBy === "device"
          ? "按终端类型"
          : groupBy === "name"
          ? "按企业"
          : "按地区"
      }`,
      font: { size: 18 },
    },
    margin: { t: 40, l: 10, r: 10, b: 10 },
  };

  // 切换分组维度
  const toggleGroupBy = () => {
    if (groupBy === "device") {
      setGroupBy("name");
    } else if (groupBy === "name") {
      setGroupBy("region");
    } else {
      setGroupBy("device");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Button onClick={toggleGroupBy}>
          切换到
          {groupBy === "device"
            ? "按企业"
            : groupBy === "name"
            ? "按地区"
            : "按终端类型"}
          视图
        </Button>
      </div>
      <Demension />
      <Plot data={data} layout={layout} config={{ responsive: true }} />
    </div>
  );
}

export default PlotlyTreemap;
