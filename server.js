var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');
var underscore = require('underscore');
var data = require('./data')

var GraphQLSchema = graphql.GraphQLSchema;
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLString = graphql.GraphQLString;
var GraphQLInt = graphql.GraphQLInt;
var GraphQLList = graphql.GraphQLList;


var pokemonType = new GraphQLObjectType({
	name: "Pokemon",
	fields: function () {
		return {
			id: {
				type: GraphQLInt
			},
			name: {
				type: GraphQLString
			},
			attack: {
				type: GraphQLInt
			},
			defense: {
				type: GraphQLInt
			},
			type: {
				type: GraphQLString
			},
			moves: {
				type: new GraphQLList(GraphQLString)
			},
		}
	}
});

var queryType = new GraphQLObjectType({
	name: "query",
	fields: function () {
		return {
			pokemonAll: {
				type: new GraphQLList(pokemonType),
				resolve: function () {
					return getThemAll();
				}
			},
			pokemonKey: {
				type:  new GraphQLList(pokemonType),
				args: {
					key: {
						type: GraphQLString
					},
					value: {
						type: GraphQLString
					}
				},
				resolve: function (_, args) {
					return getPokemonByKey(args.key, args.value);
				}
			},
			pokemon: {
				type: pokemonType,
				args: {
					id: {
						type: GraphQLInt
					}
				},
				resolve: function(_, args) {
					return	findPokemon(args.id)
				}
			}
		}
	}
});

function getPokemonByKey(key, value) {
	var pokemon = underscore.filter(data, function(pokemon) {
		return String(pokemon[key]) === value;
	});
	return pokemon;
};

function getThemAll() {
	return data;
};

function findPokemon(id) {
	return data[id];
};

var schema = new GraphQLSchema({
	query: queryType
});

var graphQLServer = express();

graphQLServer.use('/', graphqlHTTP({
	schema: schema,
	graphiql: true
}));
graphQLServer.listen(8080);
console.log("The GraphQL Server is running.")
