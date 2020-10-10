import ImageFile from '../image-file';
import {GatsbyCache, NodePluginArgs, Store} from 'gatsby';
import axios, {AxiosResponse} from 'axios';

jest.mock('axios');

describe('image-file', () => {
    const state = {
        program: {
            directory: '.'
        }
    };

    const store: Store = {
        dispatch: jest.fn(),
        subscribe: jest.fn(),
        getState: () => state,
        replaceReducer: jest.fn(),
    };

    const cache: NodePluginArgs["cache"] = new class implements GatsbyCache {
        get(): Promise<unknown> {
            return Promise.resolve(undefined);
        }

        set(): Promise<unknown> {
            return Promise.resolve(undefined);
        }
    };

    describe('getHref', () => {
        let params: {
            hasSecret: boolean;
            markers: string | string[];
            visible: string | string[];
            style: string | string[];
            path: string | string[];
            format: string;
            client: string;
        };

        it('with all params', async () => {
            const axiosResponse: AxiosResponse = {
                data: {},
                status: 200,
                statusText: "OK",
                config: {},
                headers: {}
            };

            jest.spyOn(axios, "get").mockResolvedValueOnce(axiosResponse);

            params = {
                hasSecret: false,
                markers: "test-markers",
                visible: "test-visible",
                style: "test-style",
                path: "test-path",
                format: "test-format",
                client: "test-client",
            };
            const imageFile = new ImageFile(cache, params);

            const result = await imageFile.getHref(store, "", "")

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
