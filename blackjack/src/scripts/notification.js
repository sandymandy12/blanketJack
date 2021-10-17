import { store } from 'react-notifications-component';

export class Notification {

    constructor() {
        this.ids = [];
    }
    add(n) {

        const notification = {
            title: n.id,
            message: n.text,
            type: n.type,
            container: 'top-right',
            insert: 'top',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            width: 200
        }

        let removal = [];
        if (n.timer) {
            removal = {
                dismiss: {
                    duration: 4000,
                    showIcon: true
                }
            }
        } else {
            removal = {

            }
        }
        
        store.addNotification({
            notification,
            removal
        })

        this.ids.push(n.id);

    }

    remove(_id) {
        store.removeNotification(_id)
        const idx = this.ids.indexOf(_id);
        this.ids.pop(idx);
    }
}
