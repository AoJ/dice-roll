(function(win) {
  var max = 1000;
  //monster should be loaded only in browser.
  var monster = win.monster;

  var DiceRoll = function(name, expires) {
    this.expires = expires || 7;
    this.key = "diceroll-"+name;
    this.cookieValue = (monster)?monster.get(this.key):false;
    this.tests = [];
  };

  DiceRoll.prototype.test = function(percentage, callback) {
    this.tests.push({
      percentage: percentage,
      callback: callback
    });
    return this;
  };

  DiceRoll.prototype.otherwise = function(callback) {
    this.elseCallback = callback;
    return this;
  };

  DiceRoll.prototype.run = function() {
    var rnd = Math.floor(Math.random() * max + 1);
    var start = 0;
    var pct, test, cookie, opt, val;

    for (var i = 0, c = this.tests.length; i<c; i++) {
      test = this.tests[i];

      if(!this.cookieValue) {
        pct = (test.percentage / 100) * max;

        if(rnd >= start && rnd <= (start+pct)) {
          if (monster) {
            monster.set(this.key, i.toString(), this.expires);
          }
          test.callback(test.percentage, i);
          opt = true;
        } else {
          opt = false;
        }

        start += pct + 1;
      } else if (i.toString() == this.cookieValue) {
        opt = true;
        test.callback(test.percentage, i);
      }

      if (opt) return;
    }

    //not tossed in a pool
    if (this.elseCallback)  {
      if (monster) {
        monster.set(this.key, i.toString(), this.expires);
      }
      this.elseCallback(false, i);
    }
  };

  var diceRoll = function(name, expires) {
    return new DiceRoll(name, expires);
  };

  window.diceRoll = diceRoll;
})(window);
