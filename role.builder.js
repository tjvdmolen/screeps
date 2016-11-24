/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
 //Game.spawns.Hub.createCreep([CARRY, CARRY, MOVE,CARRY, MOVE, WORK], null, {role: 'builder'});
var distance = require('utils.distance');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(state, creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
            targets = targets.sort(function(a,b){return distance(creep, a)-distance(creep, b)});
            if(targets.length) {
                creep.say("repairing");
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{                
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                //targets = targets.sort(function(a,b) { return (a.hits/a.hitsMax) - (b.hits/b.hitsMax)});
                targets = targets.sort(function(a,b) { return  (a.progressTotal-a.progress)-(b.progressTotal-b.progress)});
                
                if(targets.length > 0) {
                    creep.say("building");
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);    
                    }
                }else{
                    creep.moveTo(Game.flags["Flag1"]); 
                }
               
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_STRUCTURES, {filter:function(el){return (el instanceof StructureStorage || el instanceof  StructureContainer) && el.store[RESOURCE_ENERGY]>0}});
            sources = sources.sort(function(a,b){return distance(creep, a)-distance(creep,b)});
            creep.say('refill');
            if(sources.length){
                if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
	    }
	}
};

module.exports = roleBuilder;