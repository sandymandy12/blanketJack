import { store } from 'react-notifications-component';

function notification(_text, _type, _title="") {
    store.addNotification({
        title: _title,
        message: _text,
        type: _type,
        container: 'top-right',
        insert: 'top',
        animationIn: ['animated', 'fadeIn'],
        animationOut: ['animated', 'fadeOut'],

        dismiss: {
        duration: 4000,
        showIcon: true
        },
        width: 200
    })
}

export { notification };