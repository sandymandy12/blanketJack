import { store } from 'react-notifications-component';

export class Notification {

    constructor() {
        this.ids = [];
    }

    add(n) {

        let notification = {
            title: n.title,
            message: n.text,
            type: n.type,
            container: 'top-right',
            insert: 'top',
            animationIn: ['animated', 'fadeIn'],
            animationOut: ['animated', 'fadeOut'],
            width: 200
        }

        if (n.timer) {
            notification.dismiss = {
                duration: 2000,
                showIcon: true
            }
        } 
        
        store.addNotification(
            notification
        )

        /**
       if (n.id) {
        this.ids.push(n.id);
       }
       */

    }

    remove(_id) {
        store.removeNotification(_id)
        const idx = this.ids.indexOf(_id);
        this.ids.pop(idx);
    }

    error(e) {
        this.add({text: e.message, type: 'danger', title:'error'})
    }
}
