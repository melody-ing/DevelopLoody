import React from "react";
import { useState } from "react";
import { Stage, Layer, Rect } from "react-konva";

const Grouping = () => {
  const [shapes, setShapes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedShape, setDraggedShape] = useState(null);

  const handleDragStart = (event) => {
    const { x, y } = event.target.getStage().getPointerPosition();
    const newShape = {
      x,
      y,
      width: 100,
      height: 100,
      fill: "lightblue",
      draggable: true,
    };
    setShapes([...shapes, newShape]);
    setIsDragging(true);
    setDraggedShape(newShape);
  };

  const handleDragMove = (event) => {
    if (isDragging && draggedShape) {
      const { x, y } = event.target.getStage().getPointerPosition();
      setDraggedShape({ ...draggedShape, x, y });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedShape(null);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
    >
      <Layer>
        <Rect
          x={50}
          y={50}
          width={100}
          height={100}
          fill="lightblue"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        />
        {shapes.map((shape, index) => (
          <Rect
            key={index}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            draggable={shape.draggable}
            onDragEnd={handleDragEnd}
          />
        ))}
        {isDragging && draggedShape && (
          <Rect
            x={draggedShape.x}
            y={draggedShape.y}
            width={draggedShape.width}
            height={draggedShape.height}
            fill={draggedShape.fill}
            opacity={0.5}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default Grouping;
