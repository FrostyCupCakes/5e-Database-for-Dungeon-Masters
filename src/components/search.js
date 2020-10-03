import React from 'react';
import {connect} from 'react-redux';
import {MonsterResultCard, MonsterSearchResult} from './search/monster';
import {SpellResultCard, SpellSearchResult} from './search/spell';
import {updateReference} from '../actions/reference';

const MONSTER = 0;
const SPELL = 1;
const MAGIC_ITEM = 2;


const MagicItemResultCard = (props) => (
	<div id="resultCard">
		<div className="stat-block">
			<div className="creature-heading">
				<h1>{props.name}</h1>
			</div>
			<svg height="5" width="100%" className="tapered-rule">
			    <polyline points="0,0 400,2.5 0,5"></polyline>
			</svg>
			<div className="actions">
				<h3>Description</h3>
				<p>{props.content || props.table.entries}</p>
			</div>
		</div>
	</div>
	)

const MagicItemSearchResult = (props) => (
	<div className="search__results__result" id={props.id} onClick={props.handleResultClick}>
		<h3 id={props.id}>{props.name}</h3>
	</div>
)

const mapStateToProps = state => {
	return {
		reference: state.reference
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateReference: reference => {
			dispatch(updateReference(reference));
		}
	}
}

class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.reference;
	};

	handleTextChange = (e) => {
		const searchQuery = e.target.value;
		this.setState({searchQuery}, () => {this.props.updateReference(this.state)});
		switch(this.state.searchType){
			case MONSTER:
				this.setState({
					visibleMonsters: this.state.monsters.map((mon, id) => ({...mon, id: id})).filter(monster => {
						const textMatch = monster.name.toLowerCase().includes(searchQuery.toLowerCase());
						return textMatch;
					}, () => {this.props.updateReference(this.state)})
				});
				break;
			case SPELL:
				this.setState({
					visibleSpells: this.state.spells.map((spell, id) => ({...spell, id: id})).filter(spell => {
						const textMatch = spell.name.toLowerCase().includes(searchQuery.toLowerCase());
						return textMatch;
					})
				}, () => {this.props.updateReference(this.state)});
				break;
			case MAGIC_ITEM:
				this.setState({
					visibleMagicItems: this.state.magicItems.map((item, id) => ({...item, id: id})).filter(item => {
						const textMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
						return textMatch;
					})
				}, () => {this.props.updateReference(this.state)});
				break;		
			default: 
				return undefined;
		}
	};

	typeToMonster = (e) => {
		this.setState({searchType: MONSTER});
	};
	typeToSpell = (e) => {
		this.setState({searchType: SPELL});
	};
	typeToMagicItem = (e) => {
		this.setState({searchType: MAGIC_ITEM});
	};

	handleResultClick = (e) => {
		e.stopPropagation();
		switch (this.state.searchType) {
			case MONSTER:
				this.setState({selectedMonster: this.state.monsters[e.target.id]}, () => {this.props.updateReference(this.state)});
				break;
			case SPELL:
				this.setState({selectedSpell: this.state.spells[e.target.id]}, () => {this.props.updateReference(this.state)});
				break;
			case MAGIC_ITEM:
				this.setState({selectedMagicItem: this.state.magicItems[e.target.id]}, () => {this.props.updateReference(this.state)});
				break;
			default:
				return undefined;
		}
	};

	render () {
		return(
			<div className="searchPage">
				<div className="search">
					<div className="search__head">
						<div className="search__head__types">
							<div className=
							{this.state.searchType === MONSTER ? "search__head__types--active" : ''}
							onClick={this.typeToMonster}
							>Monsters</div>
							<div className=
							{this.state.searchType === SPELL ? "search__head__types--active" : ''}
							onClick={this.typeToSpell}>Spells</div>
							<div className=
							{this.state.searchType === MAGIC_ITEM ? "search__head__types--active": ''}
							onClick={this.typeToMagicItem}>Items</div>
						</div>
						<input 
						type="text"
						placeholder="Search"
						className="search__head__query"
						value={this.state.searchQuery}
						onChange={this.handleTextChange}
						/>
					</div>
					<div className="search__results">
					{ this.state.searchType === MONSTER 
						&& this.state.visibleMonsters.map((monster, i) => {
									return (
										<MonsterSearchResult 
										key={i} id={monster.id}
										handleResultClick={this.handleResultClick}
										{...monster}/>
									)
								})
					}
					{this.state.searchType === SPELL 
						&& this.state.visibleSpells.map((spell, i) => {
									return (
										<SpellSearchResult
										key={i} id={spell.id}
										handleResultClick={this.handleResultClick}
										{...spell}/>
									)
								})
					}
					{this.state.searchType === MAGIC_ITEM 
						&& this.state.visibleMagicItems.map((item, i) => {
									return (
										<MagicItemSearchResult
										key={i} id={item.id}
										handleResultClick={this.handleResultClick}
										{...item}/>
									)
								})
					}
					</div>
				</div>
				<div className="resultDisplay">

				{this.state.searchType === MONSTER &&
				 this.state.selectedMonster &&
				  <MonsterResultCard {...this.state.selectedMonster} />}
				{this.state.searchType === SPELL &&
				 this.state.selectedSpell &&
				  <SpellResultCard {...this.state.selectedSpell} />}
				{this.state.searchType === MAGIC_ITEM &&
				 this.state.selectedMagicItem &&
				  <MagicItemResultCard {...this.state.selectedMagicItem} />}
				</div>
			</div>

		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm); 
