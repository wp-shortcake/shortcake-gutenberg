/* global shortcodeUIData: false, wp: false, $: false, _: false */

/**
 * Utility object for batching requests for shortcode previews.
 *
 * Calling `Fetcher.queueToFetch()` will add the requested query to the
 * fetcher's array, and set a timeout to run all queries after the current call
 * stack has finished.
 */
class Fetcher {

	constructor() {
		this.counter = 0;
		this.queries = [];
		this.queueToFetch = this.queueToFetch.bind(this);
		this.fetchAll = this.fetchAll.bind(this);
	}

	/**
	 * Add a query to the queue.
	 *
	 * Adds the requested query to the next batch. Either sets a timeout to
	 * fetch previews, or adds to the current one if one is already being
	 * built. Returns a jQuery Deferred promise that will be resolved when the
	 * query is successful or otherwise complete.
	 *
	 * @param {object} query Object containing fields required to render preview: {
	 *   @var {integer} post_id Post ID
	 *   @var {string} shortcode Shortcode string to render
	 *   @var {string} nonce Preview nonce
	 * }
	 * @return {Deferred}
	 */
	queueToFetch( query ) {
		const promise = $.Deferred();
		const { setTimeout } = window;

		query.counter = ++ this.counter;

		this.queries.push( {
			promise,
			query,
			counter: this.counter
		} );

		if ( ! this.timeout ) {
			this.timeout = setTimeout( () => this.fetchAll() );
		}

		return promise;
	};

	/**
	 * Execute all queued queries.
	 *
	 * Posts to the `bulk_do_shortcode` ajax endpoint to retrieve any queued
	 * previews. When that request recieves a response, goes through the
	 * response and resolves each of the promises in it.
	 *
	 * @this {Fetcher}
	 */
	fetchAll() {
		delete this.timeout;

		const { preview: nonce } = shortcodeUIData.nonces;

		if ( 0 === this.queries.length ) {
			return;
		}

		var request = wp.ajax.post( 'bulk_do_shortcode', {
			nonce,
			queries: _.pluck( this.queries, 'query' )
		});

		request.done( responseData => {
			_.each( responseData,
				( result, index ) => {
					var matchedQuery = _.findWhere( this.queries, {
						counter: parseInt( index, 10 ),
					});

					if ( matchedQuery ) {
						this.queries = _.without( this.queries, matchedQuery );
						matchedQuery.promise.resolve( result );
					}
				}
			);
		} )
	};
}

export default new Fetcher();
