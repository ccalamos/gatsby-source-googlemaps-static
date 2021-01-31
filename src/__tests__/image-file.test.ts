import ImageFile from "../image-file";
import { GatsbyCache, NodePluginArgs, Store } from "gatsby";

import * as helpers from "../helpers";
import fs from "fs";

jest.mock("fs");

const state = {
  program: {
    directory: ".",
  },
};

const store: Store = {
  dispatch: jest.fn(),
  getState: () => state,
  replaceReducer: jest.fn(),
  subscribe: jest.fn(),
};

const cache: NodePluginArgs["cache"] = new (class implements GatsbyCache {
  public get(): Promise<unknown> {
    return Promise.resolve(undefined);
  }

  public set(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})();

describe("image-file", () => {
  describe("getHref", () => {
    let params: {
      client: string;
      format: string;
      hasSecret: boolean;
      markers: string[];
      path: string[];
      style: string[];
      visible: string[];
    };

    it("with all params", async () => {
      jest.spyOn(fs, "writeFileSync");
      jest.spyOn(fs, "mkdirSync");
      const mockFetch = jest.spyOn(helpers, "fetch");

      params = {
        client: "test-client",
        format: "test-format",
        hasSecret: false,
        markers: ["test-markers"],
        path: ["test-path"],
        style: ["test-style"],
        visible: ["test-visible"],
      };
      mockFetch.mockResolvedValueOnce(Buffer.from("jest-coverage-testing"));

      const imageFile = new ImageFile(cache, params);

      const result = await imageFile.getHref(store, "", "");

      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalled();

      expect(result.hash).toMatch(/client=test-client&/);
      expect(result.hash).toMatch(/format=test-format&/);
      expect(result.hash).toMatch(/hasSecret=false/);
      expect(result.hash).toMatch(/markers=test-markers&/);
      expect(result.hash).toMatch(/path=test-path&/);
      expect(result.hash).toMatch(/style=test-style&/);
      expect(result.hash).toMatch(/visible=test-visible$/);

      expect(result.path).toMatch(/^.cache/);
    });
  });
});
