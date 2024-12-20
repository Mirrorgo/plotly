import React, { useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Demension from "./demension";

// 基础数据结构
const nodes = [
  { id: "1", name: "小米", category: "车载", dau: 15000, stalls: 3500 },
  { id: "2", name: "华为", category: "车载", dau: 20000, stalls: 4500 },
  { id: "3", name: "比亚迪", category: "车载", dau: 25000, stalls: 5000 },
  { id: "4", name: "小米", category: "手表", dau: 12000, stalls: 3000 },
  { id: "5", name: "华为", category: "手表", dau: 18000, stalls: 40000 },
  { id: "6", name: "小天才", category: "手表", dau: 10000, stalls: 2500 },
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
  const [groupBy, setGroupBy] = useState("category");

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

    if (groupBy === "category") {
      // 按类别分组
      treeData = [
        ...treeData,
        // 分类节点
        ...Array.from(groupTotals.entries()).map(([category, totals]) => ({
          name: category,
          parent: "总计",
          dau: totals.dau,
          stalls: totals.stalls,
        })),
        // 具体品牌节点
        ...nodes.map((node) => ({
          name: `${node.name}-${node.category}`,
          parent: node.category,
          dau: node.dau,
          stalls: node.stalls,
        })),
      ];
    } else {
      // 按品牌分组
      treeData = [
        ...treeData,
        // 品牌节点
        ...Array.from(groupTotals.entries()).map(([brand, totals]) => ({
          name: brand,
          parent: "总计",
          dau: totals.dau,
          stalls: totals.stalls,
        })),
        // 具体类别节点
        ...nodes.map((node) => ({
          name: `${node.category}-${node.name}`,
          parent: node.name,
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
          [0, "#fff7ec"], // 更改配色方案为橙色系，卡顿数越多颜色越深
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
      text: `卡顿分析树形图 - ${groupBy === "category" ? "按类别" : "按品牌"}`,
      font: { size: 18 },
    },
    margin: { t: 40, l: 10, r: 10, b: 10 },
  };

  return (
    <div>
      <div className="mb-4">
        <Button
          onClick={() =>
            setGroupBy(groupBy === "category" ? "name" : "category")
          }
        >
          切换到{groupBy === "category" ? "按品牌" : "按类别"}视图
        </Button>
      </div>
      <Demension />
      <Plot data={data} layout={layout} config={{ responsive: true }} />
    </div>
  );
}

export default PlotlyTreemap;
