import './datahelper/datahelper.html';
import { Template } from "meteor/templating";
import ReactDOM from "react-dom";
import React from "react";
import DataHelper from "./datahelper/datahelper2";

Template.DataHelper.onRendered(function() {
	ReactDOM.render(<DataHelper rid={this.data.rid}/>, document.getElementById('root'));
});
Template.DataHelper.onDestroyed(function() {
	$(document).off(`click.suggestionclose.${ this.data.rid }`);
});
