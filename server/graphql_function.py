import graphene
from verutographql.schema import Query
import json


schema = graphene.Schema(query=Query)


def graphql(event, context):
    result = schema.execute(
        json.loads(event["body"])["query"]
    )

    if result.invalid:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "errors": [error.message for error in result.errors]
            }),
            "headers": {
                'Access-Control-Allow-Origin': '*'
            }
        }
    else:
        return {
            "statusCode": 200,
            "body": json.dumps(result.data),
            "headers": {
                'Access-Control-Allow-Origin': '*'
            }
        }
