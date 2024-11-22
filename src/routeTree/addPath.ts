import { abort } from "../helpers/abort";
import type { RouteTree, Segment } from "./helpers/types";

function createSegment(part: string): Segment {
  if (part === "") {
    return {
      type: "root",
    };
  }

  if (part.startsWith(":")) {
    const name = part.replace(":", "");

    return {
      type: "param",
      name,
    };
  }

  if (part === "**") {
    return {
      type: "match-any",
    };
  }

  if (part.includes("*")) {
    const pattern = `^${part.replaceAll("*", ".*")}$`;
    const regex = new RegExp(pattern);
    return {
      type: "regex",
      pattern,
      regex,
    };
  }

  return {
    type: "static",
    value: part,
  };
}

function checkIfSegmentsAreEqual(a: Segment, b: Segment): boolean {
  if (a.type !== b.type) {
    return false;
  }

  if (a.type === "root" && b.type === "root") {
    return true;
  }

  if (a.type === "static" && b.type === "static") {
    return a.value === b.value;
  }

  if (a.type === "param" && b.type === "param") {
    return a.name === b.name;
  }

  if (a.type === "regex" && b.type === "regex") {
    return a.pattern === b.pattern;
  }

  if (a.type === "match-any" && b.type === "match-any") {
    return true;
  }

  abort("Segment equality check failed");
}

const segmentWeighting: Array<Segment["type"]> = [
  "root",
  "match-any",
  "regex",
  "param",
  "static",
];

function getWeight(segment: Segment) {
  return segmentWeighting.indexOf(segment.type);
}

function compareRouteTrees(a: RouteTree<unknown>, b: RouteTree<unknown>) {
  if (a.segment.type === "static" && b.segment.type === "static") {
    return a.segment.value.localeCompare(b.segment.value);
  }

  return getWeight(b.segment) - getWeight(a.segment);
}

export function addPath<Item>(
  parts: Array<string>,
  tree: RouteTree<Item>,
  item: Item
): RouteTree<Item> {
  const [part, ...otherParts] = parts;

  if (part === undefined) {
    return {
      ...tree,
      items: [...tree.items, item],
    };
  }

  const newSegment = createSegment(part);

  const existingChild = tree.children.find((child) =>
    checkIfSegmentsAreEqual(child.segment, newSegment)
  );

  if (existingChild === undefined) {
    const newChild: RouteTree<Item> = {
      segment: newSegment,
      items: [],
      children: [],
    };

    return {
      ...tree,
      children: [...tree.children, addPath(otherParts, newChild, item)].sort(
        compareRouteTrees
      ),
    };
  } else {
    return {
      ...tree,
      children: tree.children.map((child) =>
        child === existingChild ? addPath(otherParts, child, item) : child
      ),
    };
  }
}
