import type { RouteTree, Segment, SegmentMatch } from "./helpers/types";

function matchSegment(part: string, segment: Segment): SegmentMatch | null {
  switch (segment.type) {
    case "root": {
      return part === ""
        ? {
            type: "root",
          }
        : null;
    }
    case "static": {
      return part === segment.value
        ? {
            type: "static",
          }
        : null;
    }
    case "param": {
      return {
        type: "param",
        name: segment.name,
        value: part,
      };
    }
    case "regex": {
      return segment.regex.test(part)
        ? {
            type: "regexp",
          }
        : null;
    }
    case "match-any": {
      return {
        type: "match-any",
      };
    }
  }
}

export function findRoute<Item>(
  parts: Array<string>,
  tree: RouteTree<Item>,
  segmentMatches: Array<SegmentMatch>,
  currentIndex: number
): {
  items: Array<Item>;
  segmentMatches: Array<SegmentMatch>;
} {
  const part = parts.at(currentIndex);

  if (part === undefined) {
    return { items: [], segmentMatches };
  }

  const segmentMatch = matchSegment(part, tree.segment);

  if (segmentMatch === null) {
    return { items: [], segmentMatches };
  }

  if (currentIndex === parts.length - 1 || segmentMatch.type === "match-any") {
    return {
      items: tree.items,
      segmentMatches: [...segmentMatches, segmentMatch],
    };
  }

  for (const child of tree.children) {
    const subResult = findRoute(
      parts,
      child,
      segmentMatch.type === "param"
        ? [...segmentMatches, segmentMatch]
        : segmentMatches,
      currentIndex + 1
    );

    if (subResult.items.length > 0) {
      return subResult;
    }
  }

  return {
    items: new Array<Item>(),
    segmentMatches,
  };
}
