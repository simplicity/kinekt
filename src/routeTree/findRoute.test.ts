import { describe, expect, it } from "vitest";
import { addPath } from "./addPath";
import { findRoute } from "./findRoute";
import { RouteTree, SegmentMatch } from "./helpers/types";

function expectRouted(
  hostedPaths: Array<string>,
  routedPath: string,
  expectedItems: Array<string>,
  expectedSegmentMatches?: Array<SegmentMatch>
) {
  const startAcc: RouteTree<string> = {
    segment: { type: "root" },
    children: [],
    items: [],
  };

  const tree = hostedPaths.reduce(
    (acc, hostedPath) =>
      addPath(hostedPath.replace(/^\//, "").split("/"), acc, hostedPath),
    startAcc
  );

  const result = findRoute(routedPath.split("/"), tree, [], 0);

  expect(result.items).toEqual(expectedItems);

  if (expectedSegmentMatches) {
    expect(result.segmentMatches).toEqual(expectedSegmentMatches);
  }
}

describe("findRoute", () => {
  describe("static segment", () => {
    it("routes exact match", () => expectRouted(["/a"], "/a", ["/a"]));

    it("doesn't route sub-routes", () => expectRouted(["/a"], "/a/b", []));

    it("has precedence over param segments", () =>
      expectRouted(["/a", "/:a"], "/a", ["/a"]));

    it("has precedence over regex segments", () =>
      expectRouted(["/a", "/*"], "/a", ["/a"]));

    it("has precedence over match-any segments", () =>
      expectRouted(["/a", "/**"], "/a", ["/a"]));
  });

  describe("param segment", () => {
    it("routes match", () => expectRouted(["/:a"], "/a", ["/:a"]));

    it("doesn't route sub-routes", () => expectRouted(["/:a"], "/a/b", []));

    it("has precedence over regex segments", () =>
      expectRouted(["/:a", "/*"], "/a", ["/:a"]));

    it("has precedence over match-any segments", () =>
      expectRouted(["/:a", "/**"], "/a", ["/:a"]));

    it("generates segment matches", () =>
      expectRouted(
        ["/static/:a/*/:b"],
        "/static/a/whatever/b",
        ["/static/:a/*/:b"],
        [
          { type: "param", name: "a", value: "a" },
          { type: "param", name: "b", value: "b" },
        ]
      ));
  });

  describe("regex segment", () => {
    it("routes match", () => expectRouted(["/*"], "/a", ["/*"]));

    it("routes match", () => expectRouted(["/a*c"], "/abc", ["/a*c"]));

    it("routes match", () => expectRouted(["/*c"], "/abc", ["/*c"]));

    it("routes match", () => expectRouted(["/a*"], "/abc", ["/a*"]));

    it("doesn't route sub-routes", () => expectRouted(["/*"], "/a/b", []));

    it("has precedence over match-any segments", () =>
      expectRouted(["/*a", "/**"], "/a", ["/*a"]));
  });

  describe("match-any segment", () => {
    it("routes match", () => expectRouted(["/**"], "/a", ["/**"]));

    it("routes sub-routes", () => expectRouted(["/**"], "/a/b", ["/**"]));
  });
});
