"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderPixApi = void 0;
class RenderPixApi {
    constructor() {
        this.name = 'renderPixApi';
        this.displayName = 'RenderPix API';
        this.documentationUrl = 'https://renderpix.dev/docs.html';
        this.icon = 'file:renderpix.svg';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Your RenderPix API key (starts with rpx_)',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://renderpix.dev',
                description: 'Custom RenderPix instance URL (leave default unless self-hosted)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-API-Key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/health',
                method: 'GET',
            },
        };
    }
}
exports.RenderPixApi = RenderPixApi;
//# sourceMappingURL=RenderPixApi.credentials.js.map