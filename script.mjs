/var test 1
/var testies 2
/ticker {120} {stat} {nowhisk}
/trigger {<(.+)\/(.+)hp (.+)\/(.+)m (.+)>} {/var currenthp %0;/var maxhp %1;/var currentmana %2;/var maxmana %3} {prompt}
/alias {x} {/chata}
