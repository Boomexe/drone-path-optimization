import { latLonToPos2 } from "./coordUtils";
import type { Input, InputTypes, NormalizedInput } from "./types";

export function normalizeInput(input: Input): NormalizedInput {
    return {
        origin: input.origin,

        start: {
            ...latLonToPos2(input.origin, input.origin),
            z: input.origin.height,
        },
        end: {
            ...latLonToPos2(input.destination, input.origin),
            z: input.destination.height,
        },

        floor: input.floor,
        ceiling: input.ceiling,

        obstacles: input.obstacles.map(obstacle => ({
            ...obstacle,
            points: obstacle.points.map(point => latLonToPos2(point, input.origin)),
        })),
    };
}

export function getNormalizedInput(input: InputTypes): NormalizedInput {
    if (isNormalizedInput(input)) {
        return input;
    }

    return normalizeInput(input);
}

function isNormalizedInput(input: InputTypes): input is NormalizedInput {
  return "start" in input && "end" in input;
}