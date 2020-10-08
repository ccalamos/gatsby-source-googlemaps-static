import { StyleOptions, RuleOptions } from "gatsby-source-googlemaps-static";

class Style {
    private _feature: string | undefined;
    private _element: string | undefined;
    private _rules: string[] = [];

    public constructor(options: StyleOptions) {
        this._feature = options.feature;
        this._element = options.element;

        if (typeof options.rules === "string") {
            this._rules = [options.rules];
        } else {
            this.rules = options.rules;
        }
    }

    private newOption(key: string, value: string | undefined): string {
        return value ? `${key}:${value}${encodeURIComponent("|")}` : "";
    }

    private generateParams(): string {
        const ruleStr = this._rules.length
            ? this._rules.reduce(
                  (acc, cur) => `${acc}${encodeURIComponent("|")}${cur}`
              )
            : "";

        return (
            this.newOption("feature", this._feature) +
            this.newOption("element", this._element) +
            ruleStr
        );
    }

    private set rules(newRules: RuleOptions) {
        const rules: string[] = [];

        Object.keys(newRules).forEach((key) => {
            if (newRules[key] as string) {
                rules.push(`${key}:${newRules[key] as string}`);
            }
        });

        this._rules = [...rules];
    }

    get urlParams(): string {
        return this.generateParams();
    }
}

export default Style;
