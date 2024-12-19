import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}

const D3Treemap = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 使用与 Plotly 版本相同的数据结构，但以层次化方式组织
    const data: TreeNode = {
      name: "总销售",
      children: [
        {
          name: "电子产品",
          value: 600,
          children: [
            { name: "手机", value: 350 },
            { name: "电脑", value: 250 },
            { name: "配件", value: 150 },
            { name: "平板", value: 120 },
          ],
        },
        {
          name: "服装",
          value: 400,
          children: [
            {
              name: "上装",
              value: 250,
              children: [
                { name: "T恤", value: 150 },
                { name: "衬衫", value: 100 },
              ],
            },
            {
              name: "下装",
              value: 150,
              children: [
                { name: "裤子", value: 100 },
                { name: "裙子", value: 50 },
              ],
            },
            { name: "外套", value: 180 },
          ],
        },
        {
          name: "家居",
          value: 300,
          children: [
            {
              name: "家具",
              value: 180,
              children: [
                { name: "桌椅", value: 100 },
                { name: "柜子", value: 80 },
              ],
            },
            {
              name: "家纺",
              value: 120,
              children: [
                { name: "床品", value: 70 },
                { name: "窗帘", value: 50 },
              ],
            },
          ],
        },
      ],
    };

    // 设置尺寸
    const width = 1154;
    const height = 800;

    // 清除旧内容
    d3.select(svgRef.current).selectAll("*").remove();

    // 创建颜色比例尺
    const color = d3
      .scaleOrdinal()
      .domain(data.children?.map((d) => d.name) || [])
      .range(d3.schemeTableau10);

    // 创建层次结构并计算布局
    const root = d3
      .treemap<TreeNode>()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .paddingTop(20)
      .paddingRight(3)
      .paddingBottom(3)
      .paddingLeft(3)
      .round(true)(
      d3
        .hierarchy(data)
        .sum((d) => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0))
    );

    // 创建 SVG 容器
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "12px Arial");

    // 创建叶子节点组
    const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    // 添加工具提示
    const format = d3.format(",.0f");
    leaf.append("title").text(
      (d) => `${d
        .ancestors()
        .reverse()
        .map((d) => d.data.name)
        .join(" > ")}
        \n销售额: ¥${format(d.value || 0)}`
    );

    // 添加矩形
    leaf
      .append("rect")
      .attr("fill", (d) => {
        let current = d;
        while (current.depth > 1) current = current.parent!;
        return color(current.data.name);
      })
      .attr("fill-opacity", 0.6)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("stroke", "white")
      .style("stroke-width", 2);

    // 为文本添加裁剪路径
    const clipPath = leaf
      .append("clipPath")
      .attr("id", (d, i) => `clip-${i}`)
      .append("rect")
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);

    // 添加多行文本
    const text = leaf
      .append("text")
      .attr("clip-path", (d, i) => `url(#clip-${i})`);

    // 添加名称
    text
      .append("tspan")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", 0.9)
      .style("font-weight", "bold")
      .text((d) => d.data.name);

    // 添加值
    text
      .append("tspan")
      .attr("x", 4)
      .attr("y", 25)
      .attr("fill-opacity", 0.7)
      .text((d) => `¥${format(d.value || 0)}`);

    // 添加标题
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("销售数据分布");
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3Treemap;
