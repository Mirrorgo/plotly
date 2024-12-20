import { ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useState } from "react";

function Dimension() {
  const [dimensions, setDimensions] = useState([
    { id: "device", label: "终端类型", checked: false },
    { id: "enterprise", label: "企业", checked: false },
    { id: "playMode", label: "播放模式", checked: false },
  ]);

  const handleCheck = (index: number) => {
    const newDimensions = dimensions.map((dim, i) =>
      i === index ? { ...dim, checked: !dim.checked } : dim
    );
    setDimensions(newDimensions);
  };

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

  const handleMoveRight = () => {
    // 获取所有选中项的索引（从后往前排序）
    const checkedIndices = dimensions
      .map((dim, idx) => (dim.checked ? idx : -1))
      .filter((idx) => idx !== -1)
      .reverse(); // 从后往前处理，避免移动时的干扰

    // 如果没有选中项，或者最后一个选中项已经在最右侧，则不执行
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

  const isLeftMoveDisabled = () => {
    const firstCheckedIndex = dimensions.findIndex((dim) => dim.checked);
    return firstCheckedIndex === -1 || firstCheckedIndex === 0;
  };

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

  return (
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
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleMoveRight}
          disabled={isRightMoveDisabled()}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default Dimension;
