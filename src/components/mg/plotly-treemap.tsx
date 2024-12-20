import React, { useMemo, useState } from "react";
import Plot from "react-plotly.js";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// 播放模式的显示文本映射
const playModeLabels = {
  order: "顺序播放",
  random: "随机播放",
  one_loop: "单曲循环",
};

const nodes = [
  // 小米数据
  {
    id: "1",
    name: "小米",
    device: "手机",
    playMode: "order",
    dau: 5000,
    stalls: 1200,
  },
  {
    id: "2",
    name: "小米",
    device: "手机",
    playMode: "random",
    dau: 6000,
    stalls: 1300,
  },
  {
    id: "3",
    name: "小米",
    device: "手机",
    playMode: "one_loop",
    dau: 4000,
    stalls: 1000,
  },
  {
    id: "4",
    name: "小米",
    device: "桌面",
    playMode: "order",
    dau: 4000,
    stalls: 1000,
  },
  {
    id: "5",
    name: "小米",
    device: "桌面",
    playMode: "random",
    dau: 5000,
    stalls: 1200,
  },
  {
    id: "6",
    name: "小米",
    device: "桌面",
    playMode: "one_loop",
    dau: 3000,
    stalls: 800,
  },

  // 华为数据
  {
    id: "7",
    name: "华为",
    device: "手机",
    playMode: "order",
    dau: 7000,
    stalls: 1500,
  },
  {
    id: "8",
    name: "华为",
    device: "手机",
    playMode: "random",
    dau: 8000,
    stalls: 1800,
  },
  {
    id: "9",
    name: "华为",
    device: "手机",
    playMode: "one_loop",
    dau: 5000,
    stalls: 1200,
  },
  {
    id: "10",
    name: "华为",
    device: "音箱",
    playMode: "order",
    dau: 6000,
    stalls: 13000,
  },
  {
    id: "11",
    name: "华为",
    device: "音箱",
    playMode: "random",
    dau: 7000,
    stalls: 15000,
  },
  {
    id: "12",
    name: "华为",
    device: "音箱",
    playMode: "one_loop",
    dau: 5000,
    stalls: 12000,
  },

  // 比亚迪数据
  {
    id: "13",
    name: "比亚迪",
    device: "车载",
    playMode: "order",
    dau: 8000,
    stalls: 1800,
  },
  {
    id: "14",
    name: "比亚迪",
    device: "车载",
    playMode: "random",
    dau: 9000,
    stalls: 2000,
  },
  {
    id: "15",
    name: "比亚迪",
    device: "车载",
    playMode: "one_loop",
    dau: 8000,
    stalls: 1200,
  },

  // 小天才数据
  {
    id: "16",
    name: "小天才",
    device: "手表",
    playMode: "order",
    dau: 3000,
    stalls: 800,
  },
  {
    id: "17",
    name: "小天才",
    device: "手表",
    playMode: "random",
    dau: 4000,
    stalls: 1000,
  },
  {
    id: "18",
    name: "小天才",
    device: "手表",
    playMode: "one_loop",
    dau: 3000,
    stalls: 700,
  },
];

function DynamicTreemap() {
  // 维度配置状态
  const [dimensions, setDimensions] = useState([
    { id: "device", label: "终端类型", checked: false },
    { id: "enterprise", label: "企业", checked: false },
    { id: "playMode", label: "播放模式", checked: false },
  ]);

  const [maxDepth, setMaxDepth] = useState(1);

  // 处理维度的选择
  const handleCheck = (index) => {
    const newDimensions = dimensions.map((dim, i) =>
      i === index ? { ...dim, checked: !dim.checked } : dim
    );
    setDimensions(newDimensions);
  };

  // 处理维度的左移
  const handleMoveLeft = () => {
    const checkedIndices = dimensions
      .map((dim, idx) => (dim.checked ? idx : -1))
      .filter((idx) => idx !== -1);

    if (checkedIndices.length === 0 || checkedIndices[0] === 0) {
      return;
    }

    const newDimensions = [...dimensions];
    checkedIndices.forEach((idx) => {
      [newDimensions[idx - 1], newDimensions[idx]] = [
        newDimensions[idx],
        newDimensions[idx - 1],
      ];
    });

    setDimensions(newDimensions);
  };

  // 处理维度的右移
  const handleMoveRight = () => {
    const checkedIndices = dimensions
      .map((dim, idx) => (dim.checked ? idx : -1))
      .filter((idx) => idx !== -1)
      .reverse();

    if (
      checkedIndices.length === 0 ||
      checkedIndices[0] === dimensions.length - 1
    ) {
      return;
    }

    const newDimensions = [...dimensions];
    checkedIndices.forEach((idx) => {
      [newDimensions[idx], newDimensions[idx + 1]] = [
        newDimensions[idx + 1],
        newDimensions[idx],
      ];
    });

    setDimensions(newDimensions);
  };

  // 左移按钮禁用条件
  const isLeftMoveDisabled = () => {
    const firstCheckedIndex = dimensions.findIndex((dim) => dim.checked);
    return firstCheckedIndex === -1 || firstCheckedIndex === 0;
  };

  // 右移按钮禁用条件
  const isRightMoveDisabled = () => {
    const lastCheckedIndex = dimensions
      .map((dim, idx) => ({ dim, idx }))
      .reverse()
      .find((item) => item.dim.checked)?.idx;

    return (
      lastCheckedIndex === undefined ||
      lastCheckedIndex === dimensions.length - 1
    );
  };

  // 构建树形数据
  const { labels, parents, daus, stalls } = useMemo(() => {
    const getDimensionValue = (node, dimId) => {
      switch (dimId) {
        case "device":
          return node.device;
        case "enterprise":
          return node.name;
        case "playMode":
          return playModeLabels[node.playMode];
        default:
          return "";
      }
    };

    // 获取激活的维度顺序
    const activeDimensions = dimensions.map((d) => d.id);

    // 构建树形数据结构
    let treeData = [
      {
        name: "总计",
        parent: "",
        dau: nodes.reduce((sum, node) => sum + node.dau, 0),
        stalls: nodes.reduce((sum, node) => sum + node.stalls, 0),
      },
    ];

    // 根据维度顺序构建层级
    let groups = new Map();
    activeDimensions.forEach((dim, level) => {
      const newGroups = new Map();

      nodes.forEach((node) => {
        const path = activeDimensions
          .slice(0, level + 1)
          .map((d) => getDimensionValue(node, d))
          .join("-");
        const parentPath =
          level === 0
            ? "总计"
            : activeDimensions
                .slice(0, level)
                .map((d) => getDimensionValue(node, d))
                .join("-");

        if (!newGroups.has(path)) {
          newGroups.set(path, {
            name: path,
            parent: parentPath,
            dau: 0,
            stalls: 0,
          });
        }

        const group = newGroups.get(path);
        group.dau += node.dau;
        group.stalls += node.stalls;
      });

      groups = newGroups;
      treeData.push(...Array.from(groups.values()));
    });

    return {
      labels: treeData.map((item) => item.name),
      parents: treeData.map((item) => item.parent),
      daus: treeData.map((item) => item.dau),
      stalls: treeData.map((item) => item.stalls),
    };
  }, [dimensions]);

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
      maxdepth: maxDepth + 1,
    },
  ];

  const layout = {
    width: 800,
    height: 600,
    title: {
      text: "卡顿分析树形图（点击方块可下钻查看详情）",
      font: { size: 18 },
    },
    margin: { t: 40, l: 10, r: 10, b: 10 },
  };

  const handleIncrease = () => {
    setMaxDepth((prev) => Math.min(prev + 1, 3));
  };

  const handleDecrease = () => {
    setMaxDepth((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          {dimensions.map((dim, idx) => (
            <div key={dim.id} className="flex items-center space-x-2">
              <Checkbox
                id={dim.id}
                checked={dim.checked}
                onCheckedChange={() => handleCheck(idx)}
              />
              <label
                htmlFor={dim.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {dim.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleMoveLeft}
            disabled={isLeftMoveDisabled()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleMoveRight}
            disabled={isRightMoveDisabled()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-end">
        <div>同视图下的同时可见的维度数量</div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrease}
            disabled={maxDepth >= 3}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">{maxDepth}</div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrease}
            disabled={maxDepth <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Plot data={data} layout={layout} config={{ responsive: true }} />
    </div>
  );
}

export default DynamicTreemap;
