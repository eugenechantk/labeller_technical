import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Image } from 'react-konva';
import useImage from 'use-image';

const BoundingBoxDrawer = ({ imageUrl, annotations, setAnnotations}) => {
    const [newRect, setNewRect] = useState(null);
    const stageRef = useRef();
    const [image] = useImage(imageUrl);

    const handleMouseDown = (event) => {
        const { x, y } = event.target.getStage().getPointerPosition();
        setNewRect({ x, y, width: 0, height: 0, key: Date.now() });
    };

    const handleMouseMove = (event) => {
        if (!newRect) {
            return;
        }
        const { x, y } = event.target.getStage().getPointerPosition();
        const width = x - newRect.x;
        const height = y - newRect.y;

        setNewRect({ ...newRect, width, height });
    };

    const handleMouseUp = () => {
        newRect && setAnnotations([...annotations, newRect]);
        setNewRect(null);
    };

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
        >
            <Layer>
                <Image image={image} alt=""/>
                {annotations.map((rect, i) => (
                    <Rect
                        key={i}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        fill="transparent"
                        stroke="red"
                    />
                ))}
                {newRect && (
                    <Rect
                        x={newRect.x}
                        y={newRect.y}
                        width={newRect.width}
                        height={newRect.height}
                        fill="transparent"
                        stroke="red"
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default BoundingBoxDrawer;
