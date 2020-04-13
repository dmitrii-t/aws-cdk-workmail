import {handleWithProvider, Provider} from '../../../aws/custom-resource';

interface Props {
    Message: string
}

interface Resp {

}

class WorkmailProvider implements Provider<Props, Resp> {
    create = async (props: Props): Promise<Resp> => {
        const {Message} = props;
        return Promise.resolve({'Response': `Received message ${Message}`} as Resp);
    };

    destroy = async (props: Props): Promise<Resp> => {
        return Promise.resolve({} as Resp);
    };

    update = async (props: Props): Promise<Resp> => {
        return Promise.resolve({} as Resp);
    };
}

export const main = handleWithProvider(new WorkmailProvider(), 7000);
