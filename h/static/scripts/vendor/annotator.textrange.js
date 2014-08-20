// Generated by CoffeeScript 1.6.3
/*
** Annotator 1.2.6-dev-0d3b920
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2014-08-19 23:59:28Z
*/



/*
//
*/

// Generated by CoffeeScript 1.6.3
(function() {
  var TextRangeAnchor, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TextRangeAnchor = (function(_super) {
    __extends(TextRangeAnchor, _super);

    TextRangeAnchor.Annotator = Annotator;

    function TextRangeAnchor(annotator, annotation, target, range, quote) {
      this.range = range;
      TextRangeAnchor.__super__.constructor.call(this, annotator, annotation, target, 0, 0, quote);
      if (this.range == null) {
        throw new Error("range is required!");
      }
      this.Annotator = TextRangeAnchor.Annotator;
    }

    TextRangeAnchor.prototype._createHighlight = function() {
      return new this.Annotator.TextHighlight(this, 0, this.range);
    };

    return TextRangeAnchor;

  })(Annotator.Anchor);

  Annotator.Plugin.TextRange = (function(_super) {
    __extends(TextRange, _super);

    function TextRange() {
      this.createFromRangeSelector = __bind(this.createFromRangeSelector, this);
      this._getRangeSelector = __bind(this._getRangeSelector, this);
      _ref = TextRange.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TextRange.prototype.pluginInit = function() {
      this.Annotator = Annotator;
      this.annotator.selectorCreators.push({
        name: "RangeSelector",
        describe: this._getRangeSelector
      });
      this.annotator.anchoringStrategies.push({
        name: "range",
        code: this.createFromRangeSelector
      });
      return this.annotator.TextRangeAnchor = TextRangeAnchor;
    };

    TextRange.prototype._getRangeSelector = function(selection) {
      var sr;
      if (selection.type !== "text range") {
        return [];
      }
      sr = selection.range.serialize(this.annotator.wrapper[0], '.' + this.Annotator.TextHighlight.highlightClass);
      return [
        {
          type: "RangeSelector",
          startContainer: sr.startContainer,
          startOffset: sr.startOffset,
          endContainer: sr.endContainer,
          endOffset: sr.endOffset
        }
      ];
    };

    TextRange.prototype.createFromRangeSelector = function(annotation, target) {
      var currentQuote, endInfo, endOffset, error, normedRange, range, rawQuote, savedQuote, selector, startInfo, startOffset, _base, _ref1, _ref2;
      selector = this.annotator.findSelector(target.selector, "RangeSelector");
      if (selector == null) {
        return null;
      }
      try {
        range = this.Annotator.Range.sniff(selector);
        normedRange = range.normalize(this.annotator.wrapper[0]);
      } catch (_error) {
        error = _error;
        return null;
      }
      if (this.annotator.domMapper.getInfoForNode != null) {
        startInfo = this.annotator.domMapper.getInfoForNode(normedRange.start);
        if (!startInfo) {
          return null;
        }
        startOffset = startInfo.start;
        endInfo = this.annotator.domMapper.getInfoForNode(normedRange.end);
        if (!endInfo) {
          return null;
        }
        endOffset = endInfo.end;
        rawQuote = this.annotator.domMapper.getCorpus().slice(startOffset, +(endOffset - 1) + 1 || 9e9).trim();
      } else {
        rawQuote = normedRange.text().trim();
      }
      currentQuote = this.annotator.normalizeString(rawQuote);
      savedQuote = typeof (_base = this.annotator).getQuoteForTarget === "function" ? _base.getQuoteForTarget(target) : void 0;
      if ((savedQuote != null) && currentQuote !== savedQuote) {
        return null;
      }
      if (((startInfo != null ? startInfo.start : void 0) != null) && ((endInfo != null ? endInfo.end : void 0) != null)) {
        return new this.Annotator.TextPositionAnchor(this.annotator, annotation, target, startInfo.start, endInfo.end, (_ref1 = startInfo.pageIndex) != null ? _ref1 : 0, (_ref2 = endInfo.pageIndex) != null ? _ref2 : 0, currentQuote);
      } else {
        return new TextRangeAnchor(this.annotator, annotation, target, normedRange, currentQuote);
      }
    };

    return TextRange;

  })(Annotator.Plugin);

}).call(this);

//
//# sourceMappingURL=annotator.textrange.map