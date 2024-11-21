import { describe, expect, it } from "vitest";
import { shuffle } from "../helpers/testHelpers/shuffle";
import { addPath } from "./addPath";
import { RouteTree } from "./helpers/types";

function createTree(paths: Array<string>) {
  const startAcc: RouteTree<string> = {
    segment: { type: "root" },
    children: [],
    items: [],
  };

  return paths.reduce(
    (acc, path) => addPath(path.replace(/^\//, "").split("/"), acc, path),
    startAcc
  );
}

function expectTree(result: RouteTree<string>, expectation: RouteTree<string>) {
  expect(result).toEqual(expectation);
}

function expectInvalidParamError(path: string) {
  expect(() => createTree([path])).toThrow(
    `Param segment '${path.replace(
      "/",
      ""
    )}' is invalid. It must match the regex /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.`
  );
}

describe("addPath", () => {
  it("merges items of duplicate paths", () => {
    expectTree(
      createTree(["/a", "/a"]),

      {
        segment: {
          type: "root",
        },
        children: [
          {
            segment: {
              type: "static",
              value: "a",
            },
            items: ["/a", "/a"],
            children: [],
          },
        ],
        items: [],
      }
    );
  });

  it("creates a tree from paths", () => {
    expectTree(
      createTree(["/a", "/a/b"]),

      {
        segment: {
          type: "root",
        },
        children: [
          {
            segment: {
              type: "static",
              value: "a",
            },
            items: ["/a"],
            children: [
              {
                segment: {
                  type: "static",
                  value: "b",
                },
                items: ["/a/b"],
                children: [],
              },
            ],
          },
        ],
        items: [],
      }
    );
  });

  it("orders segments by type", () => {
    expectTree(
      createTree(shuffle(["/:a", "/*", "/**", "/a"])),

      {
        segment: {
          type: "root",
        },
        children: [
          {
            segment: {
              type: "static",
              value: "a",
            },
            items: ["/a"],
            children: [],
          },
          {
            segment: {
              type: "param",
              name: "a",
            },
            items: ["/:a"],
            children: [],
          },
          {
            segment: {
              type: "regex",
              pattern: "^.*$",
              regex: new RegExp("^.*$"),
            },
            items: ["/*"],
            children: [],
          },
          {
            segment: {
              type: "match-any",
            },
            items: ["/**"],
            children: [],
          },
        ],
        items: [],
      }
    );
  });

  it("disallows certain param patterns", () => {
    expectInvalidParamError("/:a*");
    expectInvalidParamError("/:a:");
    expectInvalidParamError("/:a-");
    expectInvalidParamError("/:1");
  });
});
