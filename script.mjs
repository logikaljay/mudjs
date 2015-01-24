/substitute {It is surrounded by a black aura.} {It is surrounded by a black aura. (Egged[12])} {ConditionStats}
/substitute {It is surrounded by a bright, green aura.} {It is surrounded by a bright, green aura. (Egged[1-5])} {ConditionStats}
/substitute {It is surrounded by a faint, green aura.} {It is surrounded by a faint, green aura. (Egged[6-10])} {ConditionStats}
/substitute {It is surrounded by a flickering green aura.} {It is surrounded by a flickering green aura. (Egged[11])} {ConditionStats}
/substitute {barely clings to life.} {barely clings to life. [1%-7%]} {ConditionStats}
/substitute {grimaces in pain.} {grimaces in pain. [48%-54%]} {ConditionStats}
/substitute {grimaces with pain.} {grimaces with pain. [48%-54%]} {ConditionStats}
/substitute {has a few scratches.} {has a few scratches. [90%-99%]} {ConditionStats}
/substitute {has a nasty looking welt on the forehead.} {has a nasty looking welt on the forehead. [83%-89%]} {ConditionStats}
/substitute {has many grievous wounds.} {has many grievous wounds. [22%-28%]} {ConditionStats}
/substitute {has quite a few wounds.} {has quite a few wounds. [55%-61%]} {ConditionStats}
/substitute {has some big nasty wounds and scratches.} {has some big nasty wounds and scratches. [41%-47%]} {ConditionStats}
/substitute {has some large, gaping wounds.} {has some large, gaping wounds. [36%-40%]} {ConditionStats}
/substitute {has some minor wounds.} {has some minor wounds. [69%-75%]} {ConditionStats}
/substitute {has some nasty wounds and bleeding cuts.} {has some nasty wounds and bleeding cuts. [41%-47%]} {ConditionStats}
/substitute {has some small wounds and bruises.} {has some small wounds and bruises. [76%-82%]} {ConditionStats}
/substitute {is covered with blood from oozing wounds.} {is covered with blood from oozing wounds. [15%-21%]} {ConditionStats}
/substitute {is in excellent condition.} {is in excellent condition. [100%]} {ConditionStats}
/substitute {is vomiting blood.} {is vomiting blood. [15%-21%]} {ConditionStats}
/substitute {looks pretty awful.} {looks pretty awful. [29%-35%]} {ConditionStats}
/substitute {pales visibly as Death nears.} {pales visibly as Death nears. [8%-14%]} {ConditionStats}
/substitute {pales visibly as death nears.} {pales visibly as death nears. [8%-14%]} {ConditionStats}
/substitute {screams in agony.} {screams in agony. [22%-28%]} {ConditionStats}
/substitute {winces in pain.} {winces in pain. [62%-68%]} {ConditionStats}

/trigger {<(.+)\/(.+)hp (.+)\/(.+)m (.+)>} {/var currenthp %0;/var maxhp %1;/var currentmana %2;/var maxmana %3} {prompt}

/ticker {120} {stat} {nowhisk}
