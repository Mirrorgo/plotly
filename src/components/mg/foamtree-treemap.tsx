import { useEffect, useRef } from "react";
import { FoamTree } from "@carrotsearch/foamtree";

const FoamTreeTreeMap = () => {
  const foamtreeRef = useRef<any>(null);

  useEffect(() => {
    // 初始化 FoamTree
    foamtreeRef.current = new FoamTree({
      // 容器元素的 id
      element: document.getElementById("visualization"), // 改用 element 而不是 id

      // 数据对象
      dataObject: {
        groups: [
          {
            id: "electronics",
            label: "电子产品",
            weight: 600,
            groups: [
              { id: "phone", label: "手机", weight: 350 },
              { id: "laptop", label: "电脑", weight: 250 },
              { id: "accessories", label: "配件", weight: 150 },
              { id: "tablet", label: "平板", weight: 120 },
            ],
          },
          {
            id: "clothing",
            label: "服装",
            weight: 400,
            groups: [
              {
                id: "tops",
                label: "上装",
                weight: 250,
                groups: [
                  { id: "tshirt", label: "T恤", weight: 150 },
                  { id: "shirt", label: "衬衫", weight: 100 },
                ],
              },
              {
                id: "bottoms",
                label: "下装",
                weight: 150,
                groups: [
                  { id: "pants", label: "裤子", weight: 100 },
                  { id: "skirt", label: "裙子", weight: 50 },
                ],
              },
            ],
          },
          {
            id: "home",
            label: "家居",
            weight: 300,
            groups: [
              { id: "furniture", label: "家具", weight: 180 },
              { id: "textile", label: "家纺", weight: 120 },
            ],
          },
        ],
      },

      // 基础配置
      layout: "squarified",
      stacking: "flattened",
      maxGroupLevelsDrawn: 4,
      maxGroupLabelLevelsDrawn: 4,

      // 点击事件
      onGroupClick: (event: any) => {
        if (event.group.groups) {
          event.zoom(event.group);
        }
      },
    });

    // 窗口大小改变时重新计算大小
    const handleResize = () => {
      if (foamtreeRef.current) {
        foamtreeRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      if (foamtreeRef.current) {
        foamtreeRef.current.dispose();
      }
    };
  }, []);

  return (
    <div
      id="visualization"
      style={{
        width: "800px",
        height: "600px",
        margin: "20px auto",
      }}
    />
  );
};

export default FoamTreeTreeMap;
