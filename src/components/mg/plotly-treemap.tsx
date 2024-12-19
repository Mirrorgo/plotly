import Plot from "react-plotly.js";

function PlotlyTreemap() {
  // 可以不采用map，而是数组来表示，用来规避同名的情况
  // 但是层级过多的时候，比如车载和手表的小米都是小米，此时没法对应上实际父节点

  // 每个节点的销量数据（用于决定面积）
  const volumes = {
    总销售: 10000,
    车载: 6000,
    手表: 4000,
    小米: 1000,
    华为: 5000,
    T恤: 3000,
    裤子: 1000,
  };

  // 每个节点的销售额数据（用于决定颜色）
  const revenues = {
    总销售: 100000,
    车载: 60000,
    手表: 40000,
    小米: 35000,
    华为: 25000,
    T恤: 25000,
    裤子: 15000,
  };

  //  怎么实现筛选项的reorder？

  // 构建数据节点
  const labels = ["总销售", "车载", "手表", "小米", "华为", "T恤", "裤子"];
  const parents = ["", "总销售", "总销售", "车载", "车载", "手表", "手表"];

  const data: Plotly.Data[] = [
    {
      type: "treemap",
      labels: labels,
      parents: parents,
      values: labels.map((label) => volumes[label]), // 使用销量决定面积
      marker: {
        colors: labels.map((label) => revenues[label]), // 使用销售额决定颜色
        colorscale: [
          [0, "#edf8e9"],
          [0.5, "#74c476"],
          [1, "#006d2c"],
        ],
        showscale: true,
        colorbar: {
          title: "销售额 (元)",
          thickness: 20,
        },
        // pad: {
        //   b: 10,
        //   t: 30,
        //   l: 10,
        //   r: 10,
        // },
      },
      textinfo: "label+value",
      hovertemplate:
        "<b>%{label}</b><br>销量: %{value}<br>销售额: ¥%{marker.color:,.0f}<extra></extra>",
      branchvalues: "total", // 这个设置很重要，确保面积按比例分配
      tiling: {
        // packing: "squarify", // 使用 squarify 算法可能更适合展示比例
        packing: "dice-slice", //
        // pad: 20,
      },
    },
  ];

  const layout = {
    width: 800,
    height: 600,
    title: {
      text: "销售数据树形图 (面积=销量，颜色=销售额)",
      font: { size: 18 },
    },
    margin: { t: 40, l: 10, r: 10, b: 10 },
  };

  return (
    <div>
      <Plot data={data} layout={layout} config={{ responsive: true }} />
    </div>
  );
}

export default PlotlyTreemap;
