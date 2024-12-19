import Plot from "react-plotly.js";

function PlotlyTreemap() {
  const data: Plotly.Data[] = [
    {
      type: "treemap",
      labels: ["总销售", "电子产品", "服装", "手机", "电脑", "T恤", "裤子"],
      parents: ["", "总销售", "总销售", "电子产品", "电子产品", "服装", "服装"],
      values: [1000, 600, 400, 350, 250, 250, 150],
      marker: {
        colors: [1000, 600, 400, 350, 250, 250, 150], // 使用相同的数值作为颜色映射
        colorscale: [
          [0, "#edf8e9"], // 最小值颜色（浅绿色）
          [0.5, "#74c476"], // 中间值颜色
          [1, "#006d2c"], // 最大值颜色（深绿色）
        ],
        showscale: true, // 显示颜色比例尺
        colorbar: {
          title: "销售额",
          thickness: 20,
        },
      },
      textinfo: "label+value",
      hovertemplate: "<b>%{label}</b><br>销售额: ¥%{value:,.0f}<extra></extra>",
    },
  ];

  const layout = {
    width: 800,
    height: 600,
    title: {
      text: "销售数据树形图",
      font: { size: 18 },
    },
    margin: { t: 30, l: 10, r: 10, b: 10 },
  };
  return (
    <div>
      <Plot data={data} layout={layout} config={{ responsive: true }} />
    </div>
  );
}

export default PlotlyTreemap;
