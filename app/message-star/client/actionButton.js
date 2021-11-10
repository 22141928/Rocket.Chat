import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import { FlowRouter } from 'meteor/kadira:flow-router';
import toastr from 'toastr';

import { handleError } from '../../utils';
import { settings } from '../../settings';
import { RoomHistoryManager, MessageAction } from '../../ui-utils';
import { messageArgs } from '../../ui-utils/client/lib/messageArgs';
import { Rooms } from '../../models/client';
import { roomTypes } from '../../utils/client';
import { modal } from "../../ui-utils/client/lib/modal";

Meteor.startup(function() {
	MessageAction.addButton({
		id: 'star-message',
		icon: 'star',
		label: 'Star',
		context: ['starred', 'message', 'message-mobile', 'threads'],
		action() {
			const { msg: message } = messageArgs(this);
			message.starred = Meteor.userId();
			Meteor.call('starMessage', message, function(error) {
				if (error) {
					return handleError(error);
				}
			});
		},
		condition({ msg: message, subscription, u, room }) {
			if (subscription == null && settings.get('Message_AllowStarring')) {
				return false;
			}
			const isLivechatRoom = roomTypes.isLivechatRoom(room.t);
			if (isLivechatRoom) {
				return false;
			}

			return !message.starred || !message.starred.find((star) => star._id === u._id);
		},
		order: 9,
		group: 'menu',
	});

	MessageAction.addButton({
		id: 'unstar-message',
		icon: 'star',
		label: 'Unstar_Message',
		context: ['starred', 'message', 'message-mobile', 'threads'],
		action() {
			const { msg: message } = messageArgs(this);
			message.starred = false;
			Meteor.call('starMessage', message, function(error) {
				if (error) {
					handleError(error);
				}
			});
		},
		condition({ msg: message, subscription, u }) {
			if (subscription == null && settings.get('Message_AllowStarring')) {
				return false;
			}

			return message.starred && message.starred.find((star) => star._id === u._id);
		},
		order: 9,
		group: 'menu',
	});

	MessageAction.addButton({
		id: 'jump-to-star-message',
		icon: 'jump',
		label: 'Jump_to_message',
		context: ['starred', 'threads', 'message-mobile'],
		action() {
			const { msg: message } = messageArgs(this);
			if (window.matchMedia('(max-width: 500px)').matches) {
				Template.instance().tabBar.close();
			}
			if (message.tmid) {
				return FlowRouter.go(FlowRouter.getRouteName(), {
					tab: 'thread',
					context: message.tmid,
					rid: message.rid,
					jump: message._id,
					name: Rooms.findOne({ _id: message.rid }).name,
				}, {
					jump: message._id,
				});
			}
			RoomHistoryManager.getSurroundingMessages(message, 50);
		},
		condition({ msg, subscription, u }) {
			if (subscription == null || !settings.get('Message_AllowStarring')) {
				return false;
			}

			return msg.starred && msg.starred.find((star) => star._id === u._id);
		},
		order: 100,
		group: ['message', 'menu'],
	});

	MessageAction.addButton({
		id: 'permalink-star',
		icon: 'permalink',
		label: 'Get_link',
		classes: 'clipboard',
		context: ['starred', 'threads'],
		async action() {
			const { msg: message } = messageArgs(this);
			const permalink = await MessageAction.getPermaLink(message._id);
			navigator.clipboard.writeText(permalink);
			toastr.success(TAPi18n.__('Copied'));
		},
		condition({ msg, subscription, u }) {
			if (subscription == null) {
				return false;
			}

			return msg.starred && msg.starred.find((star) => star._id === u._id);
		},
		order: 101,
		group: 'menu',
	});

	MessageAction.addButton({
		id: 'text_summary',
		icon: 'add-reaction',
		label: '生成摘要',
		action(event){
			const { msg: message } = messageArgs(this);
			var text;
			console.log('message:',message);
			fetch(`http://10.177.35.74:5000/summary/${message.msg}`)
				.then(response=>{
					text = response.text();
					console.log('bodyData:',text);
					return text;
				}).then((text)=>{
					modal.open({
						title: '生成的摘要',
						modifier: 'modal',
						text: text,
						data: {
							text,
							onCreate() {
								modal.close();
							} },
						confirmOnEnter: false,
						showConfirmButton: false,
						showCancelButton: false,
					})
			})
		},
		order: 102,
		group: 'menu'
	})
	// MessageAction.addButton({
	// 		id: 'speech_recognition',
	// 		icon: 'user',
	// 		label: '语音识别',
	// 		action(event) {
	// 			var text = 'In neural abstractive summarization, the conventional sequence-to-sequence (seq2seq) model often suffers from repetition and semantic irrelevance. To tackle the problem, we propose a global encoding framework, which controls the information flow from the encoder to the decoder based on the global information of the source context. It consists of a convolutional gated unit to perform global encoding to improve the representations of the source-side information. Evalu- ations on the LCSTS and the English Gigaword both demonstrate that our model outperforms the baseline models, and the analysis shows that our model is capable of generating summary of higher quality and reducing repetition1.'
	// 			text = '中本聪巧妙的用了区块链技术，在每个区块头那里记录上一个区块的哈希值\n然后连同本区块所有内容一起哈希生成新的哈希值。\n这样链起来的数据结构，从第一个创世区块到当前最新区块的所有交易记录，\n都可以正确无误的反应在最新区块那里，所有全网节点对账只需要验证最新区块，\n而不需要验证所有历史区块。\n至于交易量的问题，至今也没什么好办法，\n因为比特币的区块大小决定了每秒智能处理7笔，多出来的要排队。'
	// 			setTimeout(()=>{
	// 				modal.open({
	// 					title :'文本',
	// 					text:text,
	// 					data:{
	// 						text,
	// 						onCreate() {
	// 							modal.close();
	// 						} ,
	// 					},
	// 					confirmOnEnter: false,
	// 					showConfirmButton: false,
	// 					showCancelButton: false,
	// 				})
	// 			},5000)
	// 		},
	// 		order: 103,
	// 		group: 'menu'
	// 	})
});
