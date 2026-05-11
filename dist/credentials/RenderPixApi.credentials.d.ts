import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class RenderPixApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    icon: "file:renderpix.svg";
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
