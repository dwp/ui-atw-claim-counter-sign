#!/bin/sh -e

if [ "${COMMON_NAME}" ] && [ "${HEALTH_PKI_ENDPOINT}" ]; then
    echo "INFO: Installing Certs"

    PAYLOAD_JSON_FILE=/certs/payload.json

    REQUEST_BODY=$(jq -r -n --arg domain "$COMMON_NAME" --arg altNames "$ALT_NAMES" '. | {"domain": $domain, "sans": $altNames | split(",") }')
    
    curl -X POST -H "x-dwp-requested-by: ${PRODUCT}-${ENV_ID}" -d "$REQUEST_BODY" "${HEALTH_PKI_ENDPOINT}/issue/external" > "${PAYLOAD_JSON_FILE}"

    echo "INFO: getting public cert"
    jq -r '.certificate' ${PAYLOAD_JSON_FILE} > /certs/cert.pem
    echo "INFO: getting private key"
    jq -r '.privateKey' ${PAYLOAD_JSON_FILE} > /certs/key.pem
    echo "INFO: getting our CA"
    jq -r '.chain' ${PAYLOAD_JSON_FILE} > /certs/our_ca.pem
    cat /certs/our_ca.pem >> /certs/cert.pem

    echo "INFO: getting Integration Gateway CA"
    aws ssm get-parameter --name "${INTEGRATION_GATEWAY_CA}" --output text --query "Parameter.Value" --with-decryption >> /certs/ca.pem

    rm ${PAYLOAD_JSON_FILE}
    chmod -R 0500 /certs 

fi

echo "INFO: Starting service"
export NODE_ENV=production
exec npm start
