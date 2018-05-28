import {Component} from '@angular/core';
import {AuthenticationHelper} from "../../app.authentication";
import {Router}  from '@angular/router';
import * as _ from 'lodash';
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {ApplicationAdminServices} from "../../appServices/application";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'dashboard',
    styleUrls: ['./dashboard.scss'],
    templateUrl: './dashboard.html'
})
export class Dashboard {
    cardsArray: any = [];
    droppedHeartItems: any = [];
    droppedSpadeItems: any = [];
    arrayRandom: any = [];
    droppedDiamondItems: any = [];
    droppedClubItems: any = [];

    constructor(private _spinner: BaThemeSpinner,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                private authentication: AuthenticationHelper,
                private router: Router) {
        this.getDeckCards();
        this.arrayRandom = Array.from(this.cardsArray, (val) => Math.floor(Math.random() * 40));
    }

    /**
     * get deck cards
     */
    getDeckCards() {
        this._spinner.show();
        this.appService.getAllCards().subscribe(
            data => this.getAllCardsSuccess(data),
            error => this.getAllCardsFail(error)
        );
    }

    /**
     * refresh cards on refresh button
     */
    reArrangeCards() {
        this.getDeckCards();
        this.droppedHeartItems = [];
        this.droppedSpadeItems = [];
        this.droppedDiamondItems = [];
        this.droppedClubItems = [];
    }

    /**
     * get cards success
     * @param res
     */
    getAllCardsSuccess(res) {
        this._spinner.hide();
        if (res.status < 0) {
           this.toastr.error('Failed to get all cards');
        } else {
            this.cardsArray = Array.from(res.data[0]);
        }
    }

    getAllCardsFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    /**
     * event occurs when card is dropped in card pool
     * @param data
     */
    onCardDropToPool(data: any) {
        const cardData: any = data.dragData;
        const cardType: any = cardData.card_type;
        const cardExist: any = _.some(this.cardsArray, { 'id': cardData.id });
        if (!cardExist) {
            switch (cardType) {
                case 'Spade' : {
                    this.droppedSpadeItems = _.filter(this.droppedSpadeItems, function (val) {
                        return val['id'] !== cardData.id;
                    });
                    break;
                }
                case 'Diamond' : {
                    this.droppedDiamondItems = _.filter(this.droppedDiamondItems, function (val) {
                        return val['id'] !== cardData.id;
                    });
                    break;
                }
                case 'Club' : {
                    this.droppedClubItems = _.filter(this.droppedClubItems, function (val) {
                        return val['id'] !== cardData.id;
                    });
                    break;
                }
                case 'Heart' : {
                    this.droppedHeartItems = _.filter(this.droppedHeartItems, function (val) {
                        return val['id'] !== cardData.id;
                    });
                    break;
                }
            }
            this.cardsArray.push(cardData);

        }
    }

    /**
     * event occurs when card is dropped in card pool - Heart
     * @param data
     */
    onHeartCardDrop(data: any) {
        const cardData: any = data.dragData;
        const cardType: any = cardData.card_type;
        const cardExist: any = _.some(this.droppedHeartItems, { 'id': cardData.id,'card_type': cardData.card_type });
        if (!cardExist && cardData.card_type == 'Heart') {
            this.droppedHeartItems.push(cardData);
            this.cardsArray = _.filter(this.cardsArray, function (val) {
                return val['id'] !== cardData.id;
            });
        }
    }

    /**
     * event occurs when card is dropped in card pool - Spade
     * @param data
     */
    onSpadeCardDrop(data: any) {
        const cardData: any = data.dragData;
        const cardType: any = cardData.card_type;
        const cardExist: any = _.some(this.droppedSpadeItems, { 'id': cardData.id, 'card_type': cardData.card_type });
        if (!cardExist && cardData.card_type == 'Spade') {
            this.droppedSpadeItems.push(cardData);
            this.cardsArray = _.filter(this.cardsArray, function (val) {
                return val['id'] !== cardData.id;
            });
        }

    }

    /**
     * event occurs when card is dropped in card pool - Diamond
     * @param data
     */
    onDiamondCardDrop(data: any) {
        const cardData: any = data.dragData;
        const cardType: any = cardData.card_type;
        const cardExist: any = _.some(this.droppedDiamondItems, { 'id': cardData.id, 'card_type': cardData.card_type });
        if (!cardExist && cardData.card_type == 'Diamond') {
            this.droppedDiamondItems.push(cardData);
            this.cardsArray = _.filter(this.cardsArray, function (val) {
                return val['id'] !== cardData.id;
            });
        }
    }

    /**
     * event occurs when card is dropped in card pool
     * @param data
     */
    onClubCardDrop(data: any) {
        const cardData: any = data.dragData;
        const cardType: any = cardData.card_type;
        const cardExist: any = _.some(this.droppedClubItems, { 'id': cardData.id, 'card_type': cardData.card_type });
        if (!cardExist && cardData.card_type == 'Club') {
            this.droppedClubItems.push(cardData);
            this.cardsArray = _.filter(this.cardsArray, function (val) {
                return val['id'] !== cardData.id;
            });
        }
    }
    
}
