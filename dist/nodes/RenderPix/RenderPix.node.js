"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderPix = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const renderpix_1 = require("renderpix");
class RenderPix {
    constructor() {
        this.description = {
            displayName: 'RenderPix',
            name: 'renderPix',
            icon: 'file:renderpix.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"]}}',
            description: 'Convert HTML to pixel-perfect images and capture URL screenshots',
            defaults: {
                name: 'RenderPix',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'renderPixApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Render HTML',
                            value: 'renderHtml',
                            description: 'Convert an HTML string to an image',
                            action: 'Render HTML to image',
                        },
                        {
                            name: 'Screenshot URL',
                            value: 'screenshotUrl',
                            description: 'Capture a screenshot of a public URL',
                            action: 'Screenshot a URL',
                        },
                    ],
                    default: 'renderHtml',
                },
                {
                    displayName: 'HTML',
                    name: 'html',
                    type: 'string',
                    typeOptions: { rows: 6 },
                    default: '',
                    required: true,
                    displayOptions: { show: { operation: ['renderHtml'] } },
                    description: 'Raw HTML to render. Use inline styles — external CSS may not load.',
                    placeholder: '<div style="width:1200px;height:630px;background:#0066ff;color:#fff;display:flex;align-items:center;justify-content:center;font-size:48px;font-family:sans-serif">Hello RenderPix</div>',
                },
                {
                    displayName: 'URL',
                    name: 'url',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { operation: ['screenshotUrl'] } },
                    description: 'Publicly accessible URL to capture',
                    placeholder: 'https://example.com',
                },
                {
                    displayName: 'Width',
                    name: 'width',
                    type: 'number',
                    default: 1280,
                    description: 'Viewport width in pixels',
                },
                {
                    displayName: 'Height',
                    name: 'height',
                    type: 'number',
                    default: 720,
                    description: 'Viewport height in pixels',
                },
                {
                    displayName: 'Format',
                    name: 'format',
                    type: 'options',
                    options: [
                        { name: 'PNG', value: 'png' },
                        { name: 'JPEG', value: 'jpeg' },
                        { name: 'WebP', value: 'webp' },
                    ],
                    default: 'png',
                    description: 'Output image format',
                },
                {
                    displayName: 'Quality',
                    name: 'quality',
                    type: 'number',
                    typeOptions: { minValue: 1, maxValue: 100 },
                    default: 90,
                    displayOptions: { show: { format: ['jpeg', 'webp'] } },
                    description: 'Compression quality (1–100). Only applies to JPEG and WebP.',
                },
                {
                    displayName: 'Device Scale (DPR)',
                    name: 'scale',
                    type: 'options',
                    options: [
                        { name: '1× (Standard)', value: 1 },
                        { name: '2× (Retina)', value: 2 },
                        { name: '3× (Super Retina)', value: 3 },
                    ],
                    default: 1,
                    description: 'Device pixel ratio for high-DPI / retina output',
                },
                {
                    displayName: 'Advanced Options',
                    name: 'advancedOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'CSS Selector',
                            name: 'selector',
                            type: 'string',
                            default: '',
                            description: 'Capture only the element matching this CSS selector (Pro+)',
                            placeholder: '#my-card',
                        },
                        {
                            displayName: 'Full Page',
                            name: 'fullPage',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to capture the full scrollable page height (Pro+)',
                        },
                    ],
                },
                {
                    displayName: 'Return As',
                    name: 'returnAs',
                    type: 'options',
                    options: [
                        {
                            name: 'Binary File',
                            value: 'binary',
                            description: 'Image available as binary data for downstream nodes (e.g. Write File, Send Email)',
                        },
                        {
                            name: 'Base64 String',
                            value: 'base64',
                            description: 'Raw base64-encoded image string in the JSON output',
                        },
                        {
                            name: 'Data URL',
                            value: 'dataUrl',
                            description: 'Ready-to-use data:image/... URL for embedding in HTML or sending via HTTP',
                        },
                    ],
                    default: 'binary',
                    description: 'How to return the rendered image',
                },
                {
                    displayName: 'Binary Property Name',
                    name: 'binaryPropertyName',
                    type: 'string',
                    default: 'data',
                    displayOptions: { show: { returnAs: ['binary'] } },
                    description: 'Name of the binary property to put the image in',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('renderPixApi');
        const client = new renderpix_1.RenderPix({
            apiKey: credentials.apiKey,
            baseUrl: credentials.baseUrl || 'https://renderpix.dev',
        });
        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i);
                const width = this.getNodeParameter('width', i);
                const height = this.getNodeParameter('height', i);
                const format = this.getNodeParameter('format', i);
                const quality = this.getNodeParameter('quality', i, 90);
                const scale = this.getNodeParameter('scale', i);
                const returnAs = this.getNodeParameter('returnAs', i);
                const advanced = this.getNodeParameter('advancedOptions', i, {});
                const commonParams = {
                    width,
                    height,
                    format,
                    quality: format !== 'png' ? quality : undefined,
                    scale,
                    selector: advanced.selector || undefined,
                    fullPage: advanced.fullPage || undefined,
                };
                let result;
                if (operation === 'renderHtml') {
                    const html = this.getNodeParameter('html', i);
                    result = await client.render({ html, ...commonParams });
                }
                else {
                    const url = this.getNodeParameter('url', i);
                    result = await client.screenshot({ url, ...commonParams });
                }
                const jsonMeta = {
                    success: true,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    renderTime: result.renderTime,
                    usageRemaining: result.usageRemaining,
                };
                if (returnAs === 'binary') {
                    const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
                    const filename = `renderpix-${Date.now()}.${result.format}`;
                    const mimeType = `image/${result.format}`;
                    const binaryData = await this.helpers.prepareBinaryData(result.image, filename, mimeType);
                    returnData.push({
                        json: jsonMeta,
                        binary: { [binaryPropertyName]: binaryData },
                    });
                }
                else if (returnAs === 'base64') {
                    returnData.push({
                        json: {
                            ...jsonMeta,
                            imageBase64: result.image.toString('base64'),
                        },
                    });
                }
                else {
                    returnData.push({
                        json: {
                            ...jsonMeta,
                            imageUrl: `data:image/${result.format};base64,${result.image.toString('base64')}`,
                        },
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const failErr = error;
                    returnData.push({
                        json: { success: false, error: failErr.message, code: failErr.code },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                const rpErr = error;
                if (rpErr.status !== undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), rpErr.message, {
                        itemIndex: i,
                        description: `Status ${rpErr.status}${rpErr.code ? ` · ${rpErr.code}` : ''}`,
                    });
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.RenderPix = RenderPix;
//# sourceMappingURL=RenderPix.node.js.map