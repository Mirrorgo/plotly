import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";

function PlotlyjsTreemap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const data: Partial<Plotly.PlotData>[] = [
      {
        type: "treemap",
        labels: ["总销售", "电子产品", "服装", "手机", "电脑", "T恤", "裤子"],
        parents: [
          "",
          "总销售",
          "总销售",
          "电子产品",
          "电子产品",
          "服装",
          "服装",
        ],
        values: [1000, 600, 400, 350, 250, 250, 150],
        marker: {
          colors: [1000, 600, 400, 350, 250, 250, 150],
          colorscale: [
            [0, "#edf8e9"], // 最小值颜色（浅绿色）
            [0.5, "#74c476"], // 中间值颜色
            [1, "#006d2c"], // 最大值颜色（深绿色）
          ],
          showscale: true,
          colorbar: {
            title: "销售额",
            thickness: 20,
          },
        },
        textinfo: "label+value",

        hovertemplate:
          "<b>%{label}</b><br>销售额: ¥%{value:,.0f}<extra></extra>",
        tiling: {
          // packing: "squarify",
          packing: "binary",
        },
      },
    ];

    const layout: Partial<Plotly.Layout> = {
      width: 800,
      height: 600,
      title: {
        text: "销售数据树形图",
        font: { size: 18 },
      },
      margin: { t: 30, l: 10, r: 10, b: 10 },
      autosize: true,
    };

    const config: Partial<Plotly.Config> = {
      responsive: true,
      displayModeBar: false, // 隐藏工具栏
    };

    // 创建图表
    Plotly.newPlot(containerRef.current, data, layout, config);

    // 清理函数
    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, []);

  // 添加窗口大小变化监听
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        Plotly.Plots.resize(containerRef.current);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "600px",
      }}
    />
  );
}

export default PlotlyjsTreemap;
