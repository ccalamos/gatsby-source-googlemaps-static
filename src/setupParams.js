import crypto from "crypto";
import queryString from "query-string";

const guidGenerator = hash => {
    return crypto
        .createHash("sha256")
        .update(hash)
        .digest("hex");
};

const getParams = configOptions => {
    const config = { ...configOptions };
    let center, size;

    size = config.size || "640x640";

    delete config.size;

    if (!config.center && config.latitude && config.longitude) {
        center = `${config.latitude},${config.longitude}`;

        delete config.latitude;
        delete config.longitude;
    } else {
        center = config.address;

        delete config.address;
    }

    const query = {
        zoom: "14",
        ...config,
        size: size.includes("x") ? size : `${size}x${size}`,
    };

    delete config.key;

    const hashValue =
        `center=${center}&` +
        queryString.stringify({
            zoom: "14",
            ...config,
            size: size.includes("x") ? size : `${size}x${size}`,
        });

    let params = queryString.stringify(query);

    if (!config.center) {
        params = `center=${center}&` + params;
    }

    return {
        params: params,
        hash: guidGenerator(hashValue),
        center: center || config.center,
    };
};

export default getParams;
