/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var distance = require('utils.distance');
//Game.spawns.Hub.createCreep([CARRY, MOVE, CARRY, MOVE, WORK, WORK, WORK], null, {role: 'upgrader'});
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(state, creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var sources = creep.room.find(FIND_STRUCTURES, {filter:function(el){return (el instanceof StructureStorage || el instanceof  StructureContainer) && el.store[RESOURCE_ENERGY]>0}});
            sources.sort(function(a,b){return distance(creep, a)-distance(creep,b)});
            if(sources.length==0){
                creep.moveTo(Game.flags["Flag1"]); 
                return;
            }
            if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            /*
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            */
        }
	},
	energyCharge:1500
};

module.exports = roleUpgrader;