/// <reference path="../index.d.ts" />

import { StyleOptions, RuleOptions } from "gatsby-source-googlemaps-static";

class Style {
    private _feature: string | undefined;
    private _element: string | undefined;
    private _rules: Array<string>;

    public constructor(options: StyleOptions) {
        this._feature = options.feature;
        this._element = options.element;

        if (typeof options.rules === "string") {
            this._rules = [options.rules];
        } else {
            this.rules = options.rules;
        }
    }

    private newOption(
        key: string,
        value: string | undefined,
        next = false
    ) {
        return value
            ? `${key}:${value}${next ? encodeURIComponent("|") : ""}`
            : "";
    }

    private generateParams() {
        let ruleStr = "";

        this._rules.forEach((rule, idx) => {
            ruleStr += rule;
            if (idx !== this._rules.length - 1) {
                ruleStr += encodeURIComponent("|");
            }
        });

        return (
            this.newOption("feature", this._feature, true) +
            this.newOption("element", this._element, true) +
            ruleStr
        );
    }

    private set rules(newRules: RuleOptions) {
        const rules = [];

        for (const key in newRules) {
            const isLastIdx = rules.length === Object.keys(newRules).length - 2;
            const tmpRule = this.newOption(key, newRules[key], !isLastIdx);
            if (tmpRule) {
                rules.push(tmpRule);
            }
        }

        this._rules = [...rules];
    }

    get urlParams() {
        return this.generateParams();
    }
}

export default Style;
