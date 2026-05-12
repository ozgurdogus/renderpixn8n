import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class RenderPix implements INodeType {
	description: INodeTypeDescription = {
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
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'renderPixApi',
				required: true,
			},
		],
		properties: [
			// ── Operation ────────────────────────────────────────────────────
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

			// ── HTML (renderHtml only) ────────────────────────────────────────
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

			// ── URL (screenshotUrl only) ──────────────────────────────────────
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

			// ── Common: Dimensions ────────────────────────────────────────────
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

			// ── Common: Format & Quality ──────────────────────────────────────
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

			// ── Common: Scale ─────────────────────────────────────────────────
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

			// ── Advanced Options ──────────────────────────────────────────────
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

			// ── Return As ─────────────────────────────────────────────────────
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

			// ── Binary Property Name (binary mode only) ───────────────────────
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('renderPixApi');

		const baseUrl = ((credentials.baseUrl as string) || 'https://renderpix.dev').replace(/\/$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const width = this.getNodeParameter('width', i) as number;
				const height = this.getNodeParameter('height', i) as number;
				const format = this.getNodeParameter('format', i) as 'png' | 'jpeg' | 'webp';
				const quality = this.getNodeParameter('quality', i, 90) as number;
				const scale = this.getNodeParameter('scale', i) as number;
				const returnAs = this.getNodeParameter('returnAs', i) as string;
				const advanced = this.getNodeParameter('advancedOptions', i, {}) as {
					selector?: string;
					fullPage?: boolean;
				};

				const body: Record<string, unknown> = { width, height, format, scale };
				if (format !== 'png') body.quality = quality;
				if (advanced.selector) body.selector = advanced.selector;
				if (advanced.fullPage) body.fullPage = advanced.fullPage;

				let endpoint: string;
				if (operation === 'renderHtml') {
					body.html = this.getNodeParameter('html', i) as string;
					endpoint = '/v1/render';
				} else {
					body.url = this.getNodeParameter('url', i) as string;
					endpoint = '/v1/screenshot';
				}

				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'renderPixApi',
					{
						method: 'POST',
						url: `${baseUrl}${endpoint}`,
						body,
						json: true,
						encoding: 'arraybuffer',
						returnFullResponse: true,
					},
				)) as { body: ArrayBuffer; headers: Record<string, string>; statusCode: number };

				const imageBuffer = Buffer.from(response.body);
				const resHeaders = response.headers ?? {};
				const jsonMeta = {
					success: true,
					format,
					width: parseInt(resHeaders['x-width'] ?? String(width), 10),
					height: parseInt(resHeaders['x-height'] ?? String(height), 10),
					renderTime: parseInt(resHeaders['x-render-time'] ?? '0', 10),
					usageRemaining: parseInt(resHeaders['x-usage-remaining'] ?? '0', 10),
				};

				if (returnAs === 'binary') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = await this.helpers.prepareBinaryData(
						imageBuffer,
						`renderpix-${Date.now()}.${format}`,
						`image/${format}`,
					);
					returnData.push({
						json: jsonMeta,
						binary: { [binaryPropertyName]: binaryData },
					});
				} else if (returnAs === 'base64') {
					returnData.push({
						json: { ...jsonMeta, imageBase64: imageBuffer.toString('base64') },
					});
				} else {
					returnData.push({
						json: { ...jsonMeta, imageUrl: `data:image/${format};base64,${imageBuffer.toString('base64')}` },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const err = error as { message: string; statusCode?: number };
					returnData.push({
						json: { success: false, error: err.message, statusCode: err.statusCode },
						pairedItem: { item: i },
					});
					continue;
				}
				if (error instanceof NodeOperationError) throw error;
				const err = error as { message: string; statusCode?: number };
				throw new NodeOperationError(this.getNode(), err.message, {
					itemIndex: i,
					description: err.statusCode ? `HTTP ${err.statusCode}` : undefined,
				});
			}
		}

		return [returnData];
	}
}
