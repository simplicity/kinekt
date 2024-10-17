export type Segment =
  | {
      type: "root";
    }
  | {
      type: "static";
      value: string;
    }
  | {
      type: "param";
      name: string;
    }
  | {
      type: "regex";
      pattern: string;
      regex: RegExp;
    }
  | {
      type: "match-any";
    };

export type SegmentMatch =
  | {
      type: "root";
    }
  | {
      type: "static";
    }
  | {
      type: "param";
      name: string;
      value: string;
    }
  | {
      type: "regexp";
    }
  | {
      type: "match-any";
    };

export type RouteTree<Item> = {
  segment: Segment;
  items: Array<Item>;
  children: Array<RouteTree<Item>>;
};
