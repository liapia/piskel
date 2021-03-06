/**
 * @provide pskl.tools.drawing.RectangleSelect
 *
 * @require pskl.utils
 */
(function() {
  var ns = $.namespace('pskl.tools.drawing');

  ns.RectangleSelect = function() {
    this.toolId = 'tool-rectangle-select';

    this.helpText = 'Rectangle selection';

    ns.BaseSelect.call(this);
    this.hasSelection = false;

    this.selectionOrigin_ = null;
  };

  pskl.utils.inherit(ns.RectangleSelect, ns.BaseSelect);

  /**
   * @override
   */
  ns.RectangleSelect.prototype.onSelectStart_ = function (col, row, frame, overlay) {
    this.selectionOrigin_ = {
      col : col,
      row : row
    };
    if (this.hasSelection) {
      this.hasSelection = false;
      overlay.clear();
      $.publish(Events.SELECTION_DISMISSED);
    } else {
      this.startSelection_(col, row);
      overlay.setPixel(col, row, Constants.SELECTION_TRANSPARENT_COLOR);
    }
  };

  ns.RectangleSelect.prototype.startSelection_ = function (col, row) {
    this.hasSelection = true;
    $.publish(Events.DRAG_START, [col, row]);
    // Drawing the first point of the rectangle in the fake overlay canvas:
  };

  /**
   * When creating the rectangle selection, we clear the current overlayFrame and
   * redraw the current rectangle based on the orgin coordinate and
   * the current mouse coordiinate in sprite.
   * @override
   */
  ns.RectangleSelect.prototype.onSelect_ = function (col, row, frame, overlay) {
    if (!this.hasSelection && (this.selectionOrigin_.col !== col || this.selectionOrigin_.row !== row)) {
      this.startSelection_(col, row);
    }

    if (this.hasSelection) {
      overlay.clear();
      this.selection = new pskl.selection.RectangularSelection(
        this.startCol, this.startRow, col, row);
      $.publish(Events.SELECTION_CREATED, [this.selection]);
      this.drawSelectionOnOverlay_(overlay);
    }
  };

  ns.RectangleSelect.prototype.onSelectEnd_ = function (col, row, frame, overlay) {
    if (this.hasSelection) {
      this.onSelect_(col, row, frame, overlay);
      $.publish(Events.DRAG_END, [col, row]);
    }
  };

})();
