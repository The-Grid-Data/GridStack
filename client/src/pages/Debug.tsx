import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Debug() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [queryInfo, setQueryInfo] = useState<any>(null);

  const testQuery = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/debug/test-query');
      const data = await response.json();
      setResult(data);
      setQueryInfo(data.queryInfo);
    } catch (error) {
      setResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">GraphQL API Debug Tool</h1>
          <p className="text-muted-foreground">
            Test The Grid API connection and inspect the data structure
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>
              This will query The Grid API for Wallet products and show the response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testQuery}
              disabled={testing}
              data-testid="button-test-api"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test GraphQL Query'
              )}
            </Button>
          </CardContent>
        </Card>

        {queryInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Query Details</CardTitle>
              <CardDescription>The GraphQL query being sent to The Grid API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Endpoint:</h3>
                <code className="text-xs bg-muted p-2 rounded block">
                  {queryInfo.endpoint}
                </code>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Variables:</h3>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                  {JSON.stringify(queryInfo.variables, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">GraphQL Query:</h3>
                <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                  {queryInfo.query}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {result.status === 'success' ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <CardTitle>Success!</CardTitle>
                      <CardDescription>GraphQL query executed successfully</CardDescription>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-destructive" />
                    <div>
                      <CardTitle>Error Detected</CardTitle>
                      <CardDescription>There was an issue with the GraphQL query</CardDescription>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.status === 'success' && (
                <>
                  <div>
                    <Badge variant="default" className="mb-2">
                      Products Found: {result.productCount}
                    </Badge>
                  </div>

                  {result.firstProduct && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">First Product Preview:</h3>
                      <div className="bg-muted p-4 rounded-md space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">ID:</span> {result.firstProduct.id}
                          </div>
                          <div>
                            <span className="font-medium">Name:</span> {result.firstProduct.name}
                          </div>
                          <div>
                            <span className="font-medium">Profile Name:</span>{' '}
                            {result.firstProduct.root?.profileInfos?.name || '❌ MISSING'}
                          </div>
                          <div>
                            <span className="font-medium">Logo:</span>{' '}
                            {result.firstProduct.root?.profileInfos?.logo ? '✓' : '❌ MISSING'}
                          </div>
                          <div>
                            <span className="font-medium">Description:</span>{' '}
                            {result.firstProduct.root?.profileInfos?.descriptionShort ? '✓' : '❌ MISSING'}
                          </div>
                          <div>
                            <span className="font-medium">Connection Score:</span>{' '}
                            {result.firstProduct.root?.gridRank?.score || '❌ MISSING'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {result.graphqlErrors && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-destructive">GraphQL Errors:</h3>
                  <div className="bg-destructive/10 p-4 rounded-md">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result.graphqlErrors, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {result.error && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-destructive">Error:</h3>
                  <div className="bg-destructive/10 p-4 rounded-md">
                    <p className="text-sm font-mono">{result.error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Full Response:</h3>
                <div className="bg-muted p-4 rounded-md max-h-96 overflow-auto">
                  <pre className="text-xs">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
