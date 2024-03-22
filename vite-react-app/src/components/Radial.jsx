import React, { useMemo, useState } from "react";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";
import { GradientLightgreenGreen } from "@visx/gradient";
import { scaleBand, scaleRadial } from "@visx/scale";
import { Text } from "@visx/text";

const getLetter = (d) => d.name;
const getLetterFrequency = (d) => Number(d.count) * 100;
const toDegrees = (x) => (x * 180) / Math.PI;
const margin = { top: 20, bottom: 20, left: 20, right: 20 };

export default function Radial({
  width = 550,
  height = 550,
  data,
  barColor = "#93F9B9",
}) {
  const [rotation, setRotation] = useState(0);
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radiusMax = Math.min(xMax, yMax) / 2;

  const innerRadius = radiusMax / 3;
  const xDomain = data.map(getLetter);
  const xScale = scaleBand({
    range: [0 + rotation, 2 * Math.PI + rotation],
    domain: xDomain,
    padding: 0.2,
  });
  const yScale = scaleRadial({
    range: [innerRadius, radiusMax],
    domain: [0, Math.max(...data.map(getLetterFrequency))],
  });

  return width < 10 ? null : (
    <>
      <svg width={width} height={height}>
        <GradientLightgreenGreen id="radial-bars-green" />
        <rect
          width={width}
          height={height}
          fill="transparent"
          rx={14}
        />
        <Group top={yMax / 2 + margin.top} left={xMax / 2 + margin.left}>
          {data.map((d) => {
            const letter = getLetter(d);
            const startAngle = xScale(letter);
            const midAngle = startAngle + xScale.bandwidth() / 2;
            const endAngle = startAngle + xScale.bandwidth();

            const outerRadius = yScale(getLetterFrequency(d)) ?? 0;

            // convert polar coordinates to cartesian for drawing labels
            const textRadius = outerRadius + 4;
            const textX = textRadius * Math.cos(midAngle - Math.PI / 2);
            const textY = textRadius * Math.sin(midAngle - Math.PI / 2);

            return (
              <>
                <Arc
                  key={`bar-${letter}`}
                  cornerRadius={4}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  fill={barColor}
                />
                <Text
                  x={textX}
                  y={textY}
                  dominantBaseline="end"
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight="bold"
                  fill={barColor}
                  angle={toDegrees(midAngle)}
                >
                  {letter.concat(' ', d.count)}
                </Text>
              </>
            );
          })}
        </Group>
      </svg>
      <style jsx>{`
        .controls {
          font-size: 14px;
          line-height: 1.5em;
        }
      `}</style>
    </>
  );
}
