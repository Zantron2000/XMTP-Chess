/**
 * @typedef {String} GameMessage
 * 
 * A message that represents a game state. It is a string that has
 * the following format:
 * 
 * [A-H][1-8]{32},{typeof PIECE_COLORS},[T|F]{2}
 * 
 * The first part of the string is the board, which is 32 pairs of
 * 2 characters. The first character is the letter of the column
 * and the second character is the number of the row.
 * 
 * The second part of the string is the color of the player who made the turn.
 * 
 * The third part of the string is whether or not each color can castle. The first
 * character is whether or not white can castle, and the second character is whether
 * or not black can castle. T means true, F means false.
 */