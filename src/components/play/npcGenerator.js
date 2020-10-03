import React from 'react';
import {connect} from 'react-redux';
const npc = require('../../data/npc.json');
const names = require('../../data/names.json');

const pickRandRecrsive = list => {
	if(typeof list === 'array'){
		const r = Math.floor(Math.random() * list.length);
		const type = typeof list[r];
		if(type === 'string') {
			return list[r];
		}else if(type === 'object' || type === 'array'){
			return pickRandRecrsive(list[r]);
		}

	}else if (typeof list === 'object') {
		const keys = Object.keys(list);
		const r = Math.floor(Math.random() * keys.length);
		const val = list[keys[r]];
		const type = typeof val;
		if (type === 'string') return val;
		else if (type === 'object' || type === 'array') return pickRandRecrsive(val);
	}else{
		console.error('Improper type passed to pickRandRecrsive')
	}
}

class NPCGenerator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	} 
	generateNPC = () => {
		this.setState({
			name: pickRandRecrsive(names), 
			appearance: pickRandRecrsive(npc.appearance),
			low_ability: pickRandRecrsive(npc.abilities.low_ability),
			high_ability: pickRandRecrsive(npc.abilities.high_ability),
			talent: pickRandRecrsive(npc.talents),
			interaction_trait: pickRandRecrsive(npc.interaction_traits),
			mannerism: pickRandRecrsive(npc.mannerisms),
			ideal_1: pickRandRecrsive(npc.ideals),
			ideal_2: pickRandRecrsive(npc.ideals),
			bond: pickRandRecrsive(npc.bonds),
			secret: pickRandRecrsive(npc.flaws_and_secrets)
		},() => console.log(this.state));
	}

	render() {
		return (
			<div className="NPCGenerator">
				<button onClick={this.generateNPC}>Generate a Random NPC</button>
				<br></br>
			{this.state.name && 
				<div className="NPCGenerator__Card stat-block">
					<h2>{this.state.name}</h2>
					<p>A{
						// ['a','e','i','o','u', 'h'].reduce((cond,v)=>{
						// 	if(this.state.interaction_trait[0] === v) cond = true;}, false)
						// && 'n'
					} {this.state.interaction_trait} person.</p>
					<p> With {this.state.appearance}</p>
					<p>{this.state.high_ability} but {this.state.low_ability}</p>
					<p>{this.state.talent}</p>
					<p>{this.state.mannerism}</p>
					<p><strong>Secret:</strong> {this.state.secret}</p>
				</div>
			}
			</div>
			);
	}
}

export default connect()(NPCGenerator); 
